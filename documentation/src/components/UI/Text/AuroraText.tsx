"use client"

import React, { memo, useEffect, useState } from "react"
import { ComponentPropsWithoutRef, CSSProperties, FC } from 'react';
const getTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors: propColors,
    speed = 1,
  }: AuroraTextProps) => {
    const [theme, setTheme] = useState(() => getTheme());

    useEffect(() => {
      const observer = new MutationObserver(() => setTheme(getTheme()));
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      return () => observer.disconnect();
    }, []);



    const defaultColors =
      theme === 'dark'
        ? ["#FF0000", "#FFFFFF", "#f45e5e", "#FFFFFF"]
        : ["#FF0000", "#000000", "#f45e5e", "#000000"];

    const finalColors = propColors || defaultColors;

    const gradientStyle: CSSProperties = {
      backgroundImage: `linear-gradient(135deg, ${finalColors.join(", ")}, ${finalColors[0]})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    }

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="animate-aurora relative bg-[length:200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    )
  }
)

AuroraText.displayName = "AuroraText"