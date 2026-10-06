import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'project' | 'link' | 'cta'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useSpring(0, { stiffness: 450, damping: 32 });
  const mouseY = useSpring(0, { stiffness: 450, damping: 32 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = () => {
      const hoveredElement = document.querySelector(':hover');

      if (!hoveredElement) return;

      const cursorTarget = hoveredElement.closest('[data-cursor]');
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor');
        const text = cursorTarget.getAttribute('data-cursor-text') || '';

        if (type === 'project') {
          setCursorVariant('project');
          setCursorText(text || 'VIEW');
        } else if (type === 'cta') {
          setCursorVariant('cta');
          setCursorText(text || 'TALK');
        } else if (type === 'link') {
          setCursorVariant('link');
          setCursorText('');
        }
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="custom-cursor-element pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Main Cursor follower */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'project' ? 76 : cursorVariant === 'cta' ? 68 : cursorVariant === 'link' ? 36 : 10,
          height: cursorVariant === 'project' ? 76 : cursorVariant === 'cta' ? 68 : cursorVariant === 'link' ? 36 : 10,
          backgroundColor: cursorVariant === 'default' ? '#121211' : cursorVariant === 'cta' ? '#D84C24' : '#121211',
          color: '#FAF9F5',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="rounded-full flex items-center justify-center text-[10px] font-mono tracking-widest uppercase font-semibold text-center select-none shadow-sm transition-colors duration-200"
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="tracking-wider text-white"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};
