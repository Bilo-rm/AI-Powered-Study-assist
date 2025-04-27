import { useState, useEffect } from "react";

function QuizPage({ result }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!result) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Parse quiz questions from result
      const match = result.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        const parsedQuestions = JSON.parse(match[1]);
        setQuestions(parsedQuestions);
        setTimerActive(true);
      } else {
        console.error("Failed to extract JSON from quiz result");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to parse quiz questions", error);
      setIsLoading(false);
    }
  }, [result]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && !showResults) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionSelect = (option) => {
    if (answered) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQuestionData = questions[currentQuestion];
    const isCorrect = selectedOption === currentQuestionData.answer;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("Correct! ✅");
    } else {
      setFeedback(`Incorrect! The correct answer is: ${currentQuestionData.answer} ❌`);
    }
    
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setFeedback("");
    } else {
      setShowResults(true);
      setTimerActive(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setAnswered(false);
    setFeedback("");
    setTimer(0);
    setTimerActive(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xl text-gray-700 mb-6">No quiz available. Please generate a quiz first.</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Quiz
        </a>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-xl text-gray-700 mb-6">Could not load quiz questions.</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Try Again
        </a>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage;
    let resultColor;
    
    if (percentage >= 90) {
      resultMessage = "Excellent work!";
      resultColor = "text-green-600";
    } else if (percentage >= 70) {
      resultMessage = "Great job!";
      resultColor = "text-blue-600";
    } else if (percentage >= 50) {
      resultMessage = "Good effort!";
      resultColor = "text-yellow-600";
    } else {
      resultMessage = "Keep practicing!";
      resultColor = "text-red-600";
    }
    
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-4">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
          <p className="text-gray-600 mb-8">Total time: {formatTime(timer)}</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">Score</span>
            <span className="text-2xl font-bold">{score}/{questions.length}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <p className={`text-2xl font-bold ${resultColor}`}>{percentage}%</p>
            <p className="text-lg mt-2">{resultMessage}</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Interactive Quiz</h1>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timer)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestion}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-6">{currentQuestionData.question}</h2>
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => {
                let optionClass = "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md flex items-center";
                let letterClass = "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm";
                
                if (selectedOption === option) {
                  if (answered) {
                    if (option === currentQuestionData.answer) {
                      optionClass += " bg-green-50 border-green-500";
                      letterClass += " bg-green-500 text-white";
                    } else {
                      optionClass += " bg-red-50 border-red-500";
                      letterClass += " bg-red-500 text-white";
                    }
                  } else {
                    optionClass += " bg-blue-50 border-blue-500";
                    letterClass += " bg-blue-500 text-white";
                  }
                } else if (answered && option === currentQuestionData.answer) {
                  optionClass += " bg-green-50 border-green-500";
                  letterClass += " bg-green-500 text-white";
                } else {
                  letterClass += " bg-gray-200 text-gray-700";
                }
                
                const letters = ["A", "B", "C", "D", "E", "F"];
                
                return (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={optionClass}
                  >
                    <div className={letterClass}>
                      {letters[index]}
                    </div>
                    <span>{option}</span>
                    
                    {answered && option === currentQuestionData.answer && (
                      <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    
                    {answered && selectedOption === option && option !== currentQuestionData.answer && (
                      <svg className="w-5 h-5 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {feedback && (
            <div className={`p-4 mb-6 rounded-lg ${
              feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              <div className="flex items-center">
                {feedback.includes("Correct") ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {feedback}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {!answered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-lg flex items-center ${
                  selectedOption === null
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                }`}
              >
                <span>Submit Answer</span>
                {selectedOption !== null && (
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    <span>Next Question</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>See Results</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;