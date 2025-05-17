// src/utils/docxParser.js
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

/**
 * Extract text and image information from a Word document
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<Object>} - Extracted content with text and image info
 */
const extractFromDOCX = async (filePath) => {
  try {
    // Create a temporary directory for extracted images
    const tempDir = path.join(path.dirname(filePath), 'temp_images');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Configure options to extract both text and images
    const options = {
      convertImage: mammoth.images.imgElement(image => {
        const imageIndex = imageCounter++;
        const imagePath = path.join(tempDir, `image-${imageIndex}.${image.extension}`);
        
        // Save the image to disk
        fs.writeFileSync(imagePath, image.buffer);
        
        // Return an image placeholder for the document
        return {
          src: imagePath,
          alt: `Image ${imageIndex}`
        };
      })
    };
    
    // Counter for images
    let imageCounter = 0;
    
    // Extract text with image references
    const result = await mammoth.convertToHtml({
      path: filePath
    }, options);
    
    // Extract raw text without HTML
    const textResult = await mammoth.extractRawText({
      path: filePath
    });
    
    // Count the images that were found
    const htmlContent = result.value;
    const imageMatches = htmlContent.match(/<img/g);
    const imageCount = imageMatches ? imageMatches.length : 0;
    
    // Generate image descriptions
    const imageDescriptions = [];
    if (imageCount > 0) {
      imageDescriptions.push(`Document contains ${imageCount} image(s)`);
      
      // Create placeholders for the text content
      let textWithPlaceholders = textResult.value;
      for (let i = 0; i < imageCount; i++) {
        // Find appropriate position to insert the placeholder
        // This is a simplistic approach - in a real application, you'd need more sophisticated positioning
        const paragraphs = textWithPlaceholders.split('\n\n');
        const insertionPoint = Math.min(paragraphs.length - 1, i);
        
        // Insert image placeholder at the end of the paragraph
        paragraphs[insertionPoint] += `\n[IMAGE ${i+1}]`;
        
        textWithPlaceholders = paragraphs.join('\n\n');
      }
      
      // Clean up the temporary directory (in a real app, you might want to keep these for display)
      fs.readdirSync(tempDir).forEach(file => {
        fs.unlinkSync(path.join(tempDir, file));
      });
      fs.rmdirSync(tempDir);
      
      return {
        text: textWithPlaceholders,
        imageCount: imageCount,
        imageDescriptions: imageDescriptions
      };
    }
    
    // Clean up the temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir, { recursive: true });
    }
    
    return {
      text: textResult.value,
      imageCount: 0,
      imageDescriptions: []
    };
  } catch (error) {
    console.error('Error extracting content from DOCX:', error);
    throw new Error('Failed to extract content from DOCX file');
  }
};

module.exports = extractFromDOCX;