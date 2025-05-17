"use client"
import React, { ReactNode, useEffect, useState } from "react";

interface GradientdivProps {
  children: ReactNode;
  className?: string;
}

const Gradientdiv: React.FC<GradientdivProps> = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, orange, blue 50%)`,
        transition: "background 0.2s"
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Gradientdiv; 