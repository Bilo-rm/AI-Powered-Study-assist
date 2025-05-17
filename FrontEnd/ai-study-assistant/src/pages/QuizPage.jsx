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
  const [userAnswers, setUserAnswers] = useState([]);

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
        setUserAnswers(new Array(parsedQuestions.length).fill(null));
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
    
    // Update score
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("Correct! ✅");
    } else {
      setFeedback(`Incorrect! The correct answer is: ${currentQuestionData.answer} ❌`);
    }
    
    // Save user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);
    
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(userAnswers[currentQuestion + 1] || null);
      setAnswered(userAnswers[currentQuestion + 1] !== null);
      setFeedback("");
    } else {
      setShowResults(true);
      setTimerActive(false);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(userAnswers[currentQuestion - 1] || null);
      setAnswered(userAnswers[currentQuestion - 1] !== null);
      setFeedback("");
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
    setUserAnswers(new Array(questions.length).fill(null));
    setTimerActive(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="bg-purple-50 rounded-full p-6 inline-flex mx-auto">
            <svg className="h-16 w-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">No Quiz Available</h2>
        <p className="text-lg text-gray-600 mb-6">Upload a document and generate a quiz to see it here.</p>
        <a href="/dashboard" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Generate Quiz
        </a>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="bg-red-50 rounded-full p-6 inline-flex mx-auto">
            <svg className="h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">Could Not Load Quiz</h2>
        <p className="text-lg text-gray-600 mb-6">There was a problem processing the quiz questions.</p>
        <a href="/dashboard" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Try Again
        </a>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage;
    let resultColor;
    let resultBadge;
    
    if (percentage >= 90) {
      resultMessage = "Excellent work! You've mastered this material.";
      resultColor = "text-green-600";
      resultBadge = (
        <div className="bg-green-100 text-green-800 text-lg font-semibold py-2 px-4 rounded-full inline-block">
          A+ Performance
        </div>
      );
    } else if (percentage >= 80) {
      resultMessage = "Great job! You have a strong understanding.";
      resultColor = "text-green-600";
      resultBadge = (
        <div className="bg-green-100 text-green-800 text-lg font-semibold py-2 px-4 rounded-full inline-block">
          Strong Performance
        </div>
      );
    } else if (percentage >= 70) {
      resultMessage = "Good work! You're on the right track.";
      resultColor = "text-blue-600";
      resultBadge = (
        <div className="bg-blue-100 text-blue-800 text-lg font-semibold py-2 px-4 rounded-full inline-block">
          Good Performance
        </div>
      );
    } else if (percentage >= 60) {
      resultMessage = "Not bad! With a bit more study, you'll improve quickly.";
      resultColor = "text-yellow-600";
      resultBadge = (
        <div className="bg-yellow-100 text-yellow-800 text-lg font-semibold py-2 px-4 rounded-full inline-block">
          Decent Performance
        </div>
      );
    } else {
      resultMessage = "Keep practicing! Review the material and try again.";
      resultColor = "text-red-600";
      resultBadge = (
        <div className="bg-red-100 text-red-800 text-lg font-semibold py-2 px-4 rounded-full inline-block">
          Needs Improvement
        </div>
      );
    }
    
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-600 mb-4">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600 mb-2">Total time: {formatTime(timer)}</p>
          {resultBadge}
        </div>
        
        <div className="bg-purple-50 rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">Your Score</span>
            <span className="text-2xl font-bold text-purple-900">{score}/{questions.length}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-purple-600 h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="text-center mt-6">
            <p className={`text-2xl font-bold ${resultColor}`}>{percentage}%</p>
            <p className="text-lg mt-2 text-gray-700">{resultMessage}</p>
          </div>
        </div>
        
        {/* Question review section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Review Your Answers</h2>
          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === question.answer;
              
              return (
                <div key={idx} className="p-4 bg-white border rounded-lg">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium mb-2">Question {idx + 1}: {question.question}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Your answer:</span> {userAnswer || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          <span className="font-medium">Correct answer:</span> {question.answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>
          
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Take Quiz Again
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
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
              <span>Score: {score}/{questions.filter((_, idx) => userAnswers[idx] !== null).length}</span>
            </div>
            <div className="w-full bg-purple-300 bg-opacity-40 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-6">{currentQuestionData.question}</h2>
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => {
                let optionClass = "p-4 border rounded-lg cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50";
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
                    optionClass += " bg-purple-50 border-purple-500";
                    letterClass += " bg-purple-500 text-white";
                  }
                } else if (answered && option === currentQuestionData.answer) {
                  optionClass += " bg-green-50 border-green-500";
                  letterClass += " bg-green-500 text-white";
                } else {
                  letterClass += " bg-gray-100 text-gray-700";
                }
                
                const letters = ["A", "B", "C", "D", "E", "F"];
                
                return (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={optionClass}
                  >
                    <div className="flex items-center">
                      <div className={letterClass}>
                        {letters[index]}
                      </div>
                      <span className="text-gray-800">{option}</span>
                      
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
                  </div>
                );
              })}
            </div>
          </div>

          {feedback && (
            <div className={`p-4 mb-6 rounded-lg ${
              feedback.includes("Correct") 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"
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

          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentQuestion === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            {!answered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-lg flex items-center ${
                  selectedOption === null
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                }`}
              >
                <span>Check Answer</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    <span>Next Question</span>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Finish Quiz</span>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Quiz Info Card */}
      <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Quiz Progress</h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
          {questions.map((_, idx) => {
            let bgColor = "bg-gray-200";
            if (idx === currentQuestion) {
              bgColor = "bg-purple-600";
            } else if (userAnswers[idx] !== null) {
              bgColor = userAnswers[idx] === questions[idx].answer ? "bg-green-500" : "bg-red-500";
            }
            
            return (
              <div 
                key={idx}
                className={`h-2 rounded-full ${bgColor} transition-all duration-300`}
                title={`Question ${idx + 1}`}
              ></div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>Completed: {userAnswers.filter(answer => answer !== null).length}/{questions.length}</div>
          <div>Time elapsed: {formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;