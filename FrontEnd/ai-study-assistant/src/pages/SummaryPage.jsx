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
        // Extract content from markdown code blocks if present
        const markdownMatch = result.match(/```(?:markdown)?\s*([\s\S]*?)\s*```/);
        const cleanContent = markdownMatch && markdownMatch[1] ? markdownMatch[1].trim() : result.trim();
        
        // Split content by headings to structure it
        const sections = [];
        const lines = cleanContent.split('\n');
        let currentSection = { title: "Overview", content: [] };
        
        lines.forEach(line => {
          // Check if line is a heading
          if (line.startsWith('##') || line.startsWith('# ')) {
            // If we already have content in current section, push it to sections
            if (currentSection.content.length > 0) {
              sections.push(currentSection);
            }
            // Start a new section
            const title = line.replace(/^#+\s+/, '');
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
        
        setParsedContent(sections);
      } catch (error) {
        console.error("Error processing summary:", error);
        setParsedContent([{ title: "Summary", content: [result] }]);
      } finally {
        setIsLoading(false);
      }
    };

    processContent();
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-6">
        📑 Study Summary
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !parsedContent ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl text-gray-600 mt-4">
            No summary available. Please generate a summary first.
          </p>
          <button 
            onClick={() => window.location.href='/'}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Summary
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {parsedContent.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <ReactMarkdown>
                    {section.content.join('\n')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Study Tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Review this summary regularly to reinforce key concepts
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Try explaining these concepts in your own words
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Create connections between different topics
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Combine with flashcards and quizzes for active recall
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPage;