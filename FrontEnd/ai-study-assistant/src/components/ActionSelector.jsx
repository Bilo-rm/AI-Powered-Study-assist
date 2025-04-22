function ActionSelector({ selectedAction, setSelectedAction }) {
    const actions = ["summary", "flashcards", "quiz"];
    return (
      <div className="flex gap-3">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => setSelectedAction(action)}
            className={`px-4 py-2 rounded ${
              selectedAction === action
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600"
            } hover:bg-blue-700 hover:text-white`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>
    );
  }
  
  export default ActionSelector;
  