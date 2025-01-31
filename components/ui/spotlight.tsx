"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const Spotlight = ({
  className = "",
  fill = "white",
}: {
  className?: string;
  fill?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = div.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseXRef.current = x;
      mouseYRef.current = y;
      
      // Update the CSS variables
      div.style.setProperty("--mouse-x", `${x}px`);
      div.style.setProperty("--mouse-y", `${y}px`);
    };

    div.addEventListener("mousemove", handleMouseMove);

    return () => {
      div.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute",
        className
      )}
      ref={divRef}
    >
      <div
        className="absolute inset-0 opacity-0 mix-blend-soft-light animate-spotlight"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${fill}, transparent 40%)`,
        }}
      />
    </div>
  );
}; 