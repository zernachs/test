import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className={cn(
          "w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 flex items-center justify-center",
          "shadow-md shadow-purple-700/20 relative z-10",
          className
        )}>
          <motion.span 
            initial={{ opacity: 0.9, scale: 0.9 }}
            animate={{ 
              opacity: [0.9, 1, 0.9],
              scale: [0.9, 1.03, 0.9]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white text-xl font-bold"
          >
            F
          </motion.span>
        </div>
        <motion.div 
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full blur-md -z-10"
        />
      </div>
      <div className="ml-3">
        <motion.span 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
        >
          FlyDonate
        </motion.span>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="h-0.5 bg-gradient-to-r from-purple-400/40 to-transparent mt-0.5"
        />
      </div>
    </div>
  );
}
