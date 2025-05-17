// src/utils/pptxParser.js
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

/**
 * Extract text and image information from a PowerPoint presentation
 * @param {string} filePath - Path to the PPTX file
 * @returns {Promise<Object>} - Extracted content with text and image info
 */
const extractFromPPTX = async (filePath) => {
  try {
    // PPTX files are ZIP archives containing XML files
    const zip = new AdmZip(filePath);
    const slideEntries = zip.getEntries().filter(entry => 
      entry.entryName.match(/ppt\/slides\/slide[0-9]+\.xml/)
    );
    
    // Sort slide entries by number
    slideEntries.sort((a, b) => {
      const numA = parseInt(a.entryName.match(/slide([0-9]+)\.xml/)[1]);
      const numB = parseInt(b.entryName.match(/slide([0-9]+)\.xml/)[1]);
      return numA - numB;
    });
    
    const parser = new xml2js.Parser();
    let textContent = '';
    let totalImageCount = 0;
    const imageDescriptions = [];
    
    // Process each slide to extract text and image info
    for (let i = 0; i < slideEntries.length; i++) {
      const slideXml = zip.readAsText(slideEntries[i]);
      const slideData = await parser.parseStringPromise(slideXml);
      
      // Extract text from slide
      textContent += `Slide ${i + 1}:\n`;
      const slideText = extractTextFromSlide(slideData);
      textContent += slideText.join('\n');
      
      // Look for image references
      const imageRefs = findImageRefs(slideData);
      const slideImageCount = imageRefs.length;
      
      totalImageCount += slideImageCount;
      
      if (slideImageCount > 0) {
        imageDescriptions.push(`Slide ${i + 1}: Contains ${slideImageCount} image(s)`);
        textContent += `\n[This slide contains ${slideImageCount} image(s)]\n`;
      }
      
      textContent += '\n\n';
    }
    
    return {
      text: textContent,
      imageCount: totalImageCount,
      imageDescriptions: imageDescriptions
    };
  } catch (error) {
    console.error('Error extracting content from PPTX:', error);
    throw new Error(`Failed to extract content from PowerPoint file: ${error.message}`);
  }
};

/**
 * Extract text from a PowerPoint slide
 * @param {Object} slideData - XML data object for the slide
 * @returns {Array} - Array of text strings
 */
const extractTextFromSlide = (slideData) => {
  const textElements = [];
  
  // Extract text from a:t elements (text runs)
  const extractText = (obj) => {
    if (!obj) return;
    
    // Check if this is a text element
    if (obj['a:t']) {
      obj['a:t'].forEach(textItem => {
        if (typeof textItem === 'string') {
          textElements.push(textItem);
        }
      });
      return;
    }
    
    // Recursively check all properties
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(item => {
            extractText(item);
          });
        } else if (typeof obj[key] === 'object') {
          extractText(obj[key]);
        }
      });
    }
  };
  
  // Start extraction from the slide
  extractText(slideData);
  
  return textElements;
};

/**
 * Recursively search for image references in slide XML
 * @param {Object} obj - XML data object
 * @returns {Array} - List of image references
 */
const findImageRefs = (obj) => {
  let refs = [];
  
  if (!obj) return refs;
  
  // Check if this is an image element (typically has a:blip or r:embed attributes)
  if (obj['a:blip'] || (obj.$ && obj.$['r:embed'])) {
    refs.push(obj.$ && obj.$['r:embed'] ? obj.$['r:embed'] : 'image-ref');
    return refs;
  }
  
  // Recursively check all properties
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          refs = refs.concat(findImageRefs(item));
        });
      } else if (typeof obj[key] === 'object') {
        refs = refs.concat(findImageRefs(obj[key]));
      }
    });
  }
  
  return refs;
};

module.exports = extractFromPPTX;