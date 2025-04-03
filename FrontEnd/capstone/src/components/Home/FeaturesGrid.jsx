import FeatureCard from "./FeatureCard";
import { FaBook, FaLightbulb, FaQuestion, FaClipboard } from "react-icons/fa";

const FeaturesGrid = () => {
  const features = [
    { title: "Concept Explanation", description: "Get detailed explanations on topics.", icon: <FaBook /> },
    { title: "Summarization", description: "Summarize lecture notes quickly.", icon: <FaLightbulb /> },
    { title: "Quiz Generation", description: "Generate quizzes for practice.", icon: <FaQuestion /> },
    { title: "Flash Cards", description: "Create flashcards for revision.", icon: <FaClipboard /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeaturesGrid;
