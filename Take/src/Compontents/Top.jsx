import "./rec.css";
import { motion } from "framer-motion";

const Top = ({ title, bit }) => {
  return (
    <div className="flex items-center justify-between bg-[#0a0e17] gap-8 lg:pt-15 pt-10 px-4 max-sm:flex-col sm:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className={`ml-4 flex ${
          bit ? "flex-col gap-2" : "gap-10 items-center"
        } justify-center max-sm:flex-col`}
      >
        <h3 className="text-8xl font-bold stroke lg:text-9xl text-white/90">
          {title}
        </h3>

        <div className="flex flex-col gap-2 max-sm:text-center">
          {!bit && (
            <>
              <h3 className="text-xl font-semibold uppercase tracking-[10px] text-indigo-400">
                ALL
              </h3>
              <h3 className="text-xl font-semibold tracking-[10px] text-white/50">
                TODAY
              </h3>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Top;