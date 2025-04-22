import ResultDisplay from "../components/ResultDisplay";

function SummaryPage({ result }) {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-4">📑 Summary</h1>
      <ResultDisplay result={result} />
    </div>
  );
}

export default SummaryPage;
