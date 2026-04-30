"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Gamepad2, 
  Satellite, 
  Star, 
  Home, 
  ArrowLeft, 
  Telescope,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#050511] overflow-hidden font-sans text-white selection:bg-purple-500/30">
      
      {/* --- 1. DEEP SPACE BACKGROUND --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b1543] via-[#050511] to-[#000000] z-0" />
      
      {/* Glowing Nebula Effect behind the content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* --- 2. ANIMATED STARFIELD --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Distant slow stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-slow-${i}`}
            initial={{ opacity: Math.random() * 0.5 + 0.1, scale: Math.random() * 0.5 + 0.5 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2], 
              scale: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: Math.random() * 4 + 3, 
              repeat: Infinity, 
              delay: Math.random() * 3 
            }}
            className="absolute rounded-full bg-white/70"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}

        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-star-${i}`}
            initial={{ top: "-10%", left: "110%", opacity: 1 }}
            animate={{ top: "110%", left: "-10%", opacity: 0 }}
            transition={{
              duration: Math.random() * 1.5 + 1,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 3,
              delay: Math.random() * 2
            }}
            className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[215deg] shadow-[0_0_10px_white]"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        
        {/* --- 3. THE GIANT 404 ARTWORK --- */}
        <div className="relative mb-12 flex items-center justify-center">
          
          {/* Layered 404 Text for 3D effect */}
          <div className="relative select-none">
            {/* Background shadow/glow text */}
            <span className="absolute inset-0 text-[150px] sm:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600 blur-[20px] opacity-70 translate-y-2">
              404
            </span>
            {/* Foreground text */}
            <h1 className="relative text-[150px] sm:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-purple-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              404
            </h1>
          </div>

          {/* --- FLOATING SPACE DEBRIS --- */}

          {/* Rocket */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] right-[5%] sm:right-[15%] text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]"
          >
            <Rocket size={72} fill="currentColor" className="rotate-45" />
            <motion.div 
               animate={{ opacity: [0.4, 1, 0.4], height: [20, 40, 20] }}
               transition={{ duration: 0.8, repeat: Infinity }}
               className="absolute top-[50px] left-[15px] w-3 bg-gradient-to-b from-orange-500 to-transparent blur-md rounded-full -rotate-45"
            />
          </motion.div>

          {/* Satellite */}
          <motion.div
            animate={{ y: [10, -10, 10], x: [-10, 10, -10], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[0%] sm:left-[5%] text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Satellite size={54} />
          </motion.div>

          {/* Telescope */}
          <motion.div
             animate={{ y: [-10, 10, -10], rotate: [10, -5, 10] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             className="absolute top-[20%] left-[5%] sm:left-[10%] text-indigo-400 opacity-80"
          >
            <Telescope size={48} />
          </motion.div>

          {/* Planetary Orbit Ring */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut"} }}
            className="absolute top-[25%] right-[20%] -z-10 opacity-60"
          >
             <div className="w-40 h-40 rounded-full border-[3px] border-dashed border-purple-400/40 blur-[1px]" />
          </motion.div>

          {/* Game Controller */}
          <motion.div
             animate={{ y: [-20, 0, -20], rotate: [-15, 5, -15] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             className="absolute -bottom-[5%] right-[10%] sm:right-[20%] text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          >
            <Gamepad2 size={64} fill="currentColor" className="opacity-90" />
          </motion.div>

           {/* Floating Stars / Sparkles */}
           <motion.div animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-[30%] text-yellow-300 drop-shadow-md">
              <Star size={36} fill="currentColor" />
           </motion.div>
           <motion.div animate={{ rotate: -360, scale: [1, 1.5, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-10 left-[40%] text-rose-400 drop-shadow-md">
              <Sparkles size={28} />
           </motion.div>
        </div>

        {/* --- 4. TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative z-20"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4 drop-shadow-lg">
            Houston, we have a problem.
          </h2>
          <p className="mx-auto max-w-lg text-lg text-slate-400 mb-10 leading-relaxed font-medium">
            The page you are looking for has drifted into a black hole or doesn't exist in this galaxy anymore.
          </p>
        </motion.div>

        {/* --- 5. BUTTONS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 relative z-20"
        >
          {/* Primary Button */}
          <Link href="/">
            <button className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-purple-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Home size={20} className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-purple-600" />
              <span className="relative z-10">Back to Mission Control</span>
            </button>
          </Link>

          {/* Secondary Button */}
          <button 
            onClick={() => router.back()}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-slate-800 hover:border-slate-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <ArrowLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </motion.div>

      </div>

      {/* Footer Vignette Decoration */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#050511] to-transparent z-0 pointer-events-none" />
    </div>
  );
}