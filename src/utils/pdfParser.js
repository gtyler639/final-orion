import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'

// Set up the worker - Vite will bundle the worker automatically
// Using ?url import ensures proper resolution in both dev and production
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

/**
 * Extract text content from a PDF file
 * @param {File} file - The PDF file to parse
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n\n'
    }

    return fullText.trim()
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF. Please try a different file or paste your resume text manually.')
  }
}

export default { extractTextFromPDF }
