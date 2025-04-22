function ResultDisplay({ result }) {
    if (!result) return null;
  
    let parsedResult;
    try {
      parsedResult = JSON.parse(result.data);
    } catch {
      parsedResult = result.data;
    }
  

    const resultText = parsedResult.result || parsedResult;
  
    return (
      <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre>{resultText}</pre>
      </div>
    );
  }
  
  export default ResultDisplay;
  