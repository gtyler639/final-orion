import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { getApiUrl } from '../../utils/apiConfig'

function Cater() {
  const [resumeText, setResumeText] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tailoredResume, setTailoredResume] = useState('')
  const [error, setError] = useState('')
  const [isExtractingUrl, setIsExtractingUrl] = useState(false)

  const handleExtractFromUrl = async () => {
    if (!jobUrl.trim()) {
      setError('Please enter a job URL first')
      return
    }

    setIsExtractingUrl(true)
    setError('')

    try {
      // Fetch the URL content via backend to avoid CORS
      const fetchResult = await api.fetchUrl(jobUrl)

      if (!fetchResult.success || !fetchResult.htmlContent) {
        throw new Error('Could not fetch URL content')
      }

      // Extract job description using API
      const extractResult = await api.extractJobDescription(fetchResult.htmlContent)

      if (extractResult.success && extractResult.jobDescription) {
        setJobDescription(extractResult.jobDescription)
      } else {
        throw new Error('Could not extract job description')
      }
    } catch (error) {
      console.error('Error extracting job description:', error)
      setError('Could not extract job description from URL. Please copy and paste it manually.')
    } finally {
      setIsExtractingUrl(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resumeText.trim()) {
      setError('Please enter your resume text')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description or extract one from a URL')
      return
    }

    setIsLoading(true)
    setError('')
    setTailoredResume('') // Clear previous result

    try {
      const response = await fetch(getApiUrl('/api/tailor-resume'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentResume: resumeText,
          jobDescription: jobDescription
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              continue
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setTailoredResume(prev => prev + parsed.content)
              } else if (parsed.error) {
                setError(parsed.error)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (error) {
      console.error('Error tailoring resume:', error)
      setError('Error tailoring resume. Please make sure the backend server is running and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI Resume Rewriter</h1>
        <p>Transform your resume to perfectly match any job description using AI</p>
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
          <div className="section-header">
            <div className="section-icon">📝</div>
            <h2 className="section-title">Input</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="currentResume">Current Resume</label>
              <textarea
                id="currentResume"
                className="text-input"
                placeholder="Paste your current resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows="10"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="jobUrl">Job URL (Optional)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="url"
                  id="jobUrl"
                  className="text-input"
                  placeholder="Paste job URL from LinkedIn, Indeed, or any job site..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleExtractFromUrl}
                  disabled={isExtractingUrl || !jobUrl.trim()}
                  style={{
                    padding: '10px 20px',
                    background: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isExtractingUrl ? 'Extracting...' : 'Extract'}
                </button>
              </div>
              <small style={{ color: '#667', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                💡 Paste a job URL and click Extract to auto-fill the description
              </small>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                className="text-input"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="8"
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                💡 If URL extraction doesn't work, copy-paste the job description manually
              </small>
            </div>

            <button type="submit" className="rewrite-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Rewriting Resume...
                </>
              ) : (
                'Rewrite Resume'
              )}
            </button>
          </form>
        </div>

        <div className="output-section">
          <div className="section-header">
            <div className="section-icon">✨</div>
            <h2 className="section-title">Tailored Resume</h2>
          </div>

          <div className="output-area">
            {tailoredResume || 'Your AI-tailored resume will appear here...'}
          </div>

          <button
            className="download-btn"
            onClick={() => {
              if (tailoredResume) {
                const blob = new Blob([tailoredResume], { type: 'text/plain' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'tailored-resume.txt'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              }
            }}
            disabled={!tailoredResume}
          >
            Download Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cater
