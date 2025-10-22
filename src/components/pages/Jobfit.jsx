import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { extractTextFromPDF } from '../../utils/pdfParser'

function Jobfit() {
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeContent, setResumeContent] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobRequirements, setJobRequirements] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    setResumeFile(file)
    setError('')

    if (file) {
      setIsParsing(true)
      try {
        let text = ''

        if (file.type === 'application/pdf') {
          // Use PDF parser for PDF files
          text = await extractTextFromPDF(file)
        } else {
          // Use FileReader for text files or other formats
          text = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = reject
            reader.readAsText(file)
          })
        }

        setResumeContent(text)
      } catch (error) {
        console.error('Error reading file:', error)
        setError(error.message || 'Error reading file. Please try again with a different file.')
      } finally {
        setIsParsing(false)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!resumeContent.trim()) {
      setError('Please upload your resume file')
      return
    }

    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError('Please fill in job title and description')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await api.analyzeJobFit(
        resumeContent,
        jobTitle,
        jobDescription,
        jobRequirements
      )

      if (response.success) {
        setResults({
          jobFitScore: response.jobFitScore,
          summary: response.summary,
          strengths: response.strengths,
          gaps: response.gaps,
          recommendations: response.recommendations
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error analyzing job fit:', error)
      setError('Error analyzing job fit. Please make sure the backend server is running and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Save the hassle and find out if that job is right for you.</h1>
        <a href="#scroll">Try it Out</a>
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

      <div className="main-content">
        <div className="input-column">
          <div className="form-section" id="scroll">
            <h2>Upload Your Resume Here</h2>
            <div className="form-group">
              <label htmlFor="resume">Upload Resume (PDF, DOC, DOCX, or TXT)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="resume"
                  className="file-input"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={isParsing}
                />
                <label htmlFor="resume" className="file-input-label">
                  {isParsing ? '⏳ Parsing file...' : resumeFile ? `📄 ${resumeFile.name}` : '📄 Choose resume file or drag and drop'}
                </label>
              </div>
              {resumeContent && (
                <small style={{ color: '#28a745', display: 'block', marginTop: '8px' }}>
                  ✓ Resume parsed successfully ({resumeContent.length} characters)
                </small>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Insert the Job Details</h2>
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobRequirements">Additional Requirements (Optional)</label>
              <textarea
                id="jobRequirements"
                placeholder="Any specific requirements, qualifications, or skills not mentioned in the job description..."
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
              />
            </div>
          </div>

          <button className="analyze-btn" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing Job Fit...' : '🧠 Analyze Job Fit with AI'}
          </button>
        </div>

        <div className="output-column">
          {results && (
            <div className="results">
              <h2>Analysis Results</h2>
              <div className="job-fit-score">
                <div className="score-circle">
                  <div className="score-text">{results.jobFitScore}%</div>
                </div>
                <div className="score-label">Job Fit Score</div>
              </div>

              <div className="analysis-content">
                <div className="analysis-section">
                  <h3>🎯 Overall Assessment</h3>
                  <p>{results.summary}</p>
                </div>

                <div className="analysis-section">
                  <h3>✅ Strengths & Matches</h3>
                  <ul>
                    {results.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>⚠️ Gaps & Areas for Improvement</h3>
                  <ul>
                    {results.gaps.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>💡 Recommendations</h3>
                  <ul>
                    {results.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobfit
