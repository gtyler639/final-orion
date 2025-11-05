import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { extractTextFromPDF } from '../../utils/pdfParser'

function Resume() {
  const [inputMethod, setInputMethod] = useState('text')
  const [resumeText, setResumeText] = useState('')
  const [rewrittenResume, setRewrittenResume] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')

  const handleMethodChange = (method) => {
    setInputMethod(method)
    setError('')
  }

  const handleRewrite = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text first.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await api.rewriteResume(resumeText)

      if (response.success && response.rewrittenResume) {
        setRewrittenResume(response.rewrittenResume)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error rewriting resume:', error)
      setError('Error rewriting resume. Please make sure the backend server is running and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsParsing(true)
    setError('')

    try {
      let text = ''

      if (file.type === 'application/pdf') {
        // Use PDF parser for PDF files
        text = await extractTextFromPDF(file)
      } else {
        // Use FileReader for text files
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
          reader.readAsText(file)
        })
      }

      setResumeText(text)
      setInputMethod('text')
    } catch (error) {
      console.error('Error reading file:', error)
      setError(error.message || 'Error reading file. Please try again or paste your resume text.')
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Transform your resume with AI-powered professional optimization.</h1>
        <p></p>
        <Link to="/" className="btn-secondary" style={{ marginTop: '15px', display: 'inline-block' }}>
          ← Back to Home
        </Link>
      </div>

      {error && (
        <div className="error-message" style={{
          background: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '8px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className="tool-layout">
        <div className="input-section">
          <h2 className="section-title">Enter Your Resume Here</h2>

          <div className="input-methods">
            <button
              className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
              onClick={() => handleMethodChange('text')}
            >
              ✏️ Paste Text
            </button>
            <button
              className={`method-btn ${inputMethod === 'file' ? 'active' : ''}`}
              onClick={() => handleMethodChange('file')}
            >
              📁 Upload File
            </button>
          </div>

          {isParsing && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              background: '#f0f8ff',
              borderRadius: '8px',
              margin: '20px 0'
            }}>
              <div className="loading-spinner"></div>
              <p>Parsing PDF file...</p>
            </div>
          )}

          {inputMethod === 'text' ? (
            <div id="text-method">
              <textarea
                className="text-input"
                placeholder="Paste your resume text here...

Example:
John Smith
Email: john@email.com
Phone: (555) 123-4567

EXPERIENCE
Sales Associate at ABC Store (2022-2024)
- Helped customers
- Sold products
- Worked with team

EDUCATION
Bachelor's Degree in Business
State University (2018-2022)

SKILLS
- Communication
- Sales
- Customer service"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          ) : (
            <div id="file-method" className="file-upload-container">
              <div
                className="file-upload"
                onClick={() => document.getElementById('file-input').click()}
              >
                <div className="upload-icon">📄</div>
                <h3>Drop your resume here or click to browse</h3>
                <p>Supports PDF, Word, and text files</p>
                <input
                  type="file"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          )}

          <button
            className="rewrite-btn"
            onClick={handleRewrite}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span className="btn-text">Rewriting Resume...</span>
              </>
            ) : (
              <span className="btn-text">✨ Rewrite My Resume</span>
            )}
          </button>
        </div>

        <div className="output-section">
          <h2 className="section-title">Optimized Resume</h2>
          <textarea
            className="output-area"
            placeholder="Your professionally rewritten resume will appear here..."
            value={rewrittenResume}
            readOnly
          />
          <button
            className="download-btn"
            onClick={() => {
              if (rewrittenResume) {
                const blob = new Blob([rewrittenResume], { type: 'text/plain' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `optimized_resume_${new Date().toISOString().slice(0, 10)}.txt`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              }
            }}
            disabled={!rewrittenResume}
          >
            💾 Download Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default Resume
