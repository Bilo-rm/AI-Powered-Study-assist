import Flashcard from "../components/Flashcard";

function FlashcardsPage({ result }) {
  if (!result || !result.result) {
    console.log("No result or result.result is missing:", result);
    return <p>No flashcards available. Please generate them first.</p>;
  }

  let flashcards = [];

  try {
    console.log("Raw result.result content:", result.result);  // Log the result.result

    const rawJsonString = result.result;  // Get the raw JSON string

    
    const match = rawJsonString.match(/```json\s*([\s\S]*?)\s*```/);

    if (match && match[1]) {
      flashcards = JSON.parse(match[1]);  // Parse the JSON inside the backticks
      console.log("Parsed flashcards:", flashcards);  // Log parsed flashcards
    } else {
      console.error("Failed to extract JSON from result string:", rawJsonString);
    }
  } catch (error) {
    console.error("Failed to parse flashcards JSON", error);
    flashcards = [];
  }

  if (flashcards.length === 0) {
    console.log("No flashcards found after parsing.");
    return <p>No flashcards found in the generated result.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🃏 Flashcards</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {flashcards.map((card, index) => (
          <Flashcard key={index} term={card.term} definition={card.definition} />
        ))}
      </div>
    </div>
  );
}

export default FlashcardsPage;
