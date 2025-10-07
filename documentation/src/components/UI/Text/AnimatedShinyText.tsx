import { ComponentPropsWithoutRef, CSSProperties, FC, useEffect, useState } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<'span'> {
  shimmerWidth?: number;
}

const getTheme = (): string => {
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const gradientColor = theme === 'dark' ? 'via-white' : 'via-black';
  const textColor =
    theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        `mx-auto max-w-md  ${textColor} `,

        // Shine effect
        'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',

        // Shine gradient (conditional)
        `bg-gradient-to-r from-transparent ${gradientColor} via-50% to-transparent`,

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
