import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressbar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-5 mb-5 relative overflow-hidden">
      <motion.div
        className="bg-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${Math.min(animatedProgress, 100)}%`, // Ensure width never exceeds 100%
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {progress >= 100 && isMediaUploading && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 opacity-50"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ zIndex: 2 }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default MediaProgressbar;
