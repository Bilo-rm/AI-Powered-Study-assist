// src/utils/fileParser.js
const path = require('path');
const fs = require('fs');
const extractFromPDF = require('./pdfParser');
const extractFromDOCX = require('./docxParser');
const extractFromPPTX = require('./pptxParser');

/**
 * Extract text and image information from various document formats
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Extracted content
 */
const parseFile = async (filePath) => {
  try {
    // Get file extension
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Choose parser based on file extension
    let result;
    
    switch (fileExtension) {
      case '.pdf':
        result = await extractFromPDF(filePath);
        break;
      
      case '.docx':
      case '.doc':
        result = await extractFromDOCX(filePath);
        break;
      
      case '.pptx':
      case '.ppt':
        result = await extractFromPPTX(filePath);
        break;
      
      case '.txt':
        // For text files, simply read the contents
        const textContent = fs.readFileSync(filePath, 'utf8');
        result = {
          text: textContent,
          imageCount: 0,
          imageDescriptions: []
        };
        break;
      
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
    
    // Create combined text with image information
    let combinedText = result.text;
    
    // Add image summary at the end if there are images
    if (result.imageCount > 0) {
      combinedText += '\n\n--- Image Information ---\n';
      combinedText += `Total images: ${result.imageCount}\n`;
      if (result.imageDescriptions && result.imageDescriptions.length > 0) {
        combinedText += 'Details:\n';
        result.imageDescriptions.forEach(desc => {
          combinedText += `- ${desc}\n`;
        });
      }
    }
    
    return {
      text: combinedText,
      extractedData: result
    };
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

module.exports = parseFile;