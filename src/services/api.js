const API_BASE_URL = '/api'

export const api = {
  // Resume rewriting
  rewriteResume: async (resumeText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewrite-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Job fit analysis
  analyzeJobFit: async (resumeContent, jobTitle, jobDescription, jobRequirements) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-job-fit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent,
          jobTitle,
          jobDescription,
          jobRequirements,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Fetch URL content
  fetchUrl: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetch-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Extract job description from URL
  extractJobDescription: async (htmlContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/extract-job-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Tailor resume to job description
  tailorResume: async (currentResume, jobDescription) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tailor-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentResume,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Test API key
  testApiKey: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-api-key`)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },
}

export default api
