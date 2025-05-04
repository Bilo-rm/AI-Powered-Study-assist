// src/untils/pdfParser.js (maintaining your folder structure)
const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF
    const data = await pdfParse(pdfBuffer);
    
    // Return the text content
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

module.exports = extractTextFromPDF;