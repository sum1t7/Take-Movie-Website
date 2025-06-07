import React, { useState } from "react";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import NavBar from "./NavBar";

const Recs = () => {
  const [userInput, setUserInput] = useState("");
  const [AIresponse, setAIResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeWithAI = async () => {
    const prompt = `The Answer should not be more than 200 words or less than 20.Analyze the following user input and determine their Mood and Genre preference they want to watch.
    User input: "${userInput}"
    Format your response just like this:
    Genre : [Genre Category]
    Movies/tvshows : [List of 5-7 movie recommendations based on the mood and highlight them]
    You can try to use emojis with the movie titles.
    If the user input is not related to movies or tv shows, respond with "I am not sure about that, please try again with a movie or tv show related query."
    `;

    try {
      setIsLoading(true);
      const response = await fetch(`https://gemma-endpoint.vercel.app/api/prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setAIResponse(data.response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-32 bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h1
            className="lg:text-8xl sm:text-6xl text-5xl text-center font-bold "
            style={{
              WebkitTextStroke: "1px #f4a8ff",
              color: "transparent",
              textTransform: "uppercase",
            }}
          >
            What Mood is you in?
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="p-10  justify-center items-center flex flex-col gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(sanitizeInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userInput.trim()) {
                  analyzeWithAI();
                }
              }}
              placeholder="I enjoyed Fight club, recommend me some like that..."
              className="w-full h-14 px-6 py-4   rounded-full 
            border-2 border-fuchsia-500/30 focus:border-fuchsia-500 
            focus:ring-2 focus:ring-fuchsia-500/20 
            bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400
            transition-all duration-300 shadow-lg shadow-fuchsia-500/5 "
            />

            <button
              onClick={analyzeWithAI}
              disabled={!userInput.trim()}
              className="w-fit rounded-full cursor-pointer bg-fuchsia-400 hover:bg-fuchsia-700
            disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold 
            py-1 px-4 transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? <>Analyzing your mood...</> : <>Explore</>}
            </button>
          </div>
        </motion.div>

        {AIresponse && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-12"
          >
            <div className="max-w-2xl mx-auto  p-6 bg-gray-800/50 border border-gray-600 rounded-xl shadow-lg">
                <Markdown>{AIresponse}</Markdown>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Recs;
