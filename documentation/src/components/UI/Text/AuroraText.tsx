"use client"

import React, { memo, useEffect, useState } from "react"
import { ComponentPropsWithoutRef, CSSProperties, FC } from 'react';

const getClientTheme = (): string => {
  return document.documentElement.getAttribute('data-theme') || 'light';
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
    const [theme, setTheme] = useState<string | undefined>(undefined);

    useEffect(() => {
      // 2. Set the initial theme ONLY after the component mounts
      setTheme(getClientTheme());

      // 3. Keep the observer logic to handle theme *changes*
      const observer = new MutationObserver(() => setTheme(getClientTheme()));
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
          className="animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent"
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