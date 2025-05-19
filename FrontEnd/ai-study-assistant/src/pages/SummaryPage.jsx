import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function SummaryPage({ result }) {
  const [parsedContent, setParsedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!result) {
      setIsLoading(false);
      return;
    }

    const processContent = () => {
      try {
        // SAFETY CHECK - Ensure result is a string
        const resultString = typeof result === 'string' 
          ? result 
          : typeof result === 'object'
            ? JSON.stringify(result)
            : String(result);
            
        // Extract content from markdown code blocks if present
        const markdownMatch = resultString.match(/```(?:markdown)?\s*([\s\S]*?)\s*```/);
        const cleanContent = markdownMatch && markdownMatch[1] ? markdownMatch[1].trim() : resultString.trim();
        
        // Convert the text to markdown format for proper rendering
        // This will handle bold text (**text**) and bullet points
        const markdownContent = cleanContent
          // Ensure double asterisks for bold text are preserved
          .replace(/\*\*([^*]+)\*\*/g, '**$1**')
          // Ensure bullet points are properly formatted
          .replace(/^[•*-]\s+/gm, '* ')
          // Ensure nested bullet points have proper indentation
          .replace(/^(\s+)[•*-]\s+/gm, (match, p1) => '  '.repeat(p1.length/2) + '* ');
        
        // Split content by headings to structure it
        const sections = [];
        const lines = markdownContent.split('\n');
        let currentSection = { title: "Overview", content: [] };
        
        lines.forEach(line => {
          // Check if line is a heading (starts with # or ##, or is bold text at the beginning of a line)
          if (line.startsWith('##') || line.startsWith('# ') || /^\*\*[^*]+\*\*$/.test(line)) {
            // If we already have content in current section, push it to sections
            if (currentSection.content.length > 0) {
              sections.push(currentSection);
            }
            // Start a new section
            // Extract title text, removing markdown formatting
            const title = line.replace(/^#+\s+/, '').replace(/^\*\*|\*\*$/g, '');
            currentSection = { title, content: [] };
          } else if (line.trim() !== '') {
            // Add line to current section
            currentSection.content.push(line);
          }
        });
        
        // Add the last section
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        
        // If no sections with explicit headings were found, create basic structure
        if (sections.length === 0) {
          const firstLine = lines.find(line => line.trim() !== '');
          setParsedContent([{ 
            title: firstLine?.replace(/^\*\*|\*\*$/g, '') || "Summary", 
            content: lines.filter(l => l.trim() !== '' && l !== firstLine)
          }]);
        } else {
          setParsedContent(sections);
        }
      } catch (error) {
        console.error("Error processing summary:", error);
        
        // If we encounter an error, try to create a basic section with the raw result
        const fallbackContent = typeof result === 'string' 
          ? result 
          : typeof result === 'object'
            ? JSON.stringify(result, null, 2)
            : String(result);
            
        setParsedContent([{ title: "Summary", content: [fallbackContent] }]);
      } finally {
        setIsLoading(false);
      }
    };

    processContent();
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-6">
        📑 Study Summary
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : !parsedContent ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-purple-50 rounded-full p-6 inline-flex mx-auto mb-4">
            <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-purple-900 mb-2">No Summary Available</h2>
          <p className="text-lg text-gray-600 mb-6">
            Upload a document and generate a summary to see it here.
          </p>
          <button 
            onClick={() => window.location.href='/dashboard'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Generate Summary
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {parsedContent.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="p-6">
                <div className="prose prose-purple max-w-none prose-headings:font-bold prose-headings:text-purple-800 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-purple-800 prose-ul:pl-5 prose-ol:pl-5 prose-li:mb-1">
                  <ReactMarkdown>
                    {section.content.join('\n')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Study Tips
            </h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Review this summary regularly to reinforce key concepts</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Try explaining these concepts in your own words</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Create connections between different topics</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Combine with flashcards and quizzes for active recall</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-purple-100 flex justify-between">
              <button
                onClick={() => window.location.href='/dashboard/flashcards'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Create Flashcards
              </button>
              
              <button
                onClick={() => window.location.href='/dashboard/quiz'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take a Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Print/Save Options */}
      {parsedContent && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm mr-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          
          <button
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([parsedContent.map(section => 
                `# ${section.title}\n\n${section.content.join('\n')}`
              ).join('\n\n')], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "summary.txt";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save as Text
          </button>
        </div>
      )}
    </div>
  );
}

export default SummaryPage;