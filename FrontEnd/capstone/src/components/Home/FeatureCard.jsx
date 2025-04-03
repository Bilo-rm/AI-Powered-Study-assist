import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      className="bg-white p-6 rounded-lg shadow-lg text-center w-64 border border-gray-300"
    >
      <div className="text-4xl mb-4 text-[#53C844]">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
