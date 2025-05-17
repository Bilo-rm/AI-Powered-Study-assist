// src/utils/pdfParser.js
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

/**
 * Extract text and image information from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Extracted content with text and image info
 */
const extractFromPDF = async (filePath) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF for text
    const data = await pdfParse(pdfBuffer);
    const textContent = data.text;
    
    // Use pdf2json to get image information
    const imageInfo = await extractImageInfoFromPDF(filePath);
    
    return {
      text: textContent,
      imageCount: imageInfo.count,
      imageDescriptions: imageInfo.descriptions
    };
  } catch (error) {
    console.error('Error extracting content from PDF:', error);
    throw new Error('Failed to extract content from PDF');
  }
};

/**
 * Extract image information from PDF
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Image info with count and descriptions
 */
const extractImageInfoFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    
    pdfParser.on("pdfParser_dataReady", pdfData => {
      try {
        const pages = pdfData.Pages || [];
        let imageCount = 0;
        const imageDescriptions = [];
        
        // Go through each page and count images
        pages.forEach((page, pageIndex) => {
          if (page.Fills && page.Fills.length > 0) {
            // Images are often represented as fills
            const pageImageCount = page.Fills.filter(fill => 
              fill.oc && fill.oc.includes('Image')).length;
            
            if (pageImageCount > 0) {
              imageCount += pageImageCount;
              imageDescriptions.push(`Page ${pageIndex + 1}: Contains ${pageImageCount} image(s)`);
            }
          }
        });
        
        resolve({
          count: imageCount,
          descriptions: imageDescriptions
        });
      } catch (error) {
        console.error('Error parsing PDF images:', error);
        // If image detection fails, don't fail the entire process
        resolve({
          count: 0,
          descriptions: ['Image detection failed, document may contain undetected images']
        });
      }
    });
    
    pdfParser.loadPDF(filePath);
  });
};

module.exports = extractFromPDF;