import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const AnimatedCodeVisual: React.FC = () => {
  const [activeLine, setActiveLine] = useState(0);

  const codeSnippets = [
    { text: 'const product = await architectPRD(spec);', color: 'text-[#D84C24]' },
    { text: 'const app = new NextApp({ typeSafe: true });', color: 'text-blue-600' },
    { text: 'await app.deploy({ lighthouse: 98 });', color: 'text-emerald-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-[#121211] text-white border border-white/10 shadow-lg relative overflow-hidden font-mono text-[11px]">
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-white/50">
          <Terminal className="w-3 h-3 text-accent" />
          <span>engineer.ts</span>
        </div>
      </div>

      {/* Animated Code Area */}
      <div className="py-2.5 space-y-1.5 flex-1">
        {codeSnippets.map((snippet, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: activeLine >= idx ? 1 : 0.35,
              x: activeLine === idx ? 2 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 leading-relaxed"
          >
            <span className="text-white/30 text-[10px] select-none">{idx + 1}</span>
            <span className={snippet.color}>{snippet.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Terminal Status Footer */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">Production Ready</span>
        </div>
        <span className="text-white/40">60 FPS</span>
      </div>
    </div>
  );
};
