import { ComponentPropsWithoutRef, CSSProperties, FC, useEffect, useState } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<'span'> {
  shimmerWidth?: number;
}

const getClientTheme = (): string => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
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
        'animate-shiny-text bg-clip-text bg-no-repeat bg-position-[0_0] bg-size-[var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',

        // Shine gradient (conditional)
        `bg-linear-to-r from-transparent ${gradientColor} via-50% to-transparent`,

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
