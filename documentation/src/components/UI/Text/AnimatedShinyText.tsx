import { ComponentPropsWithoutRef, CSSProperties, FC } from 'react';

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
  const theme = getTheme();

  const gradientColor = theme === 'dark' ? 'via-white/80' : 'via-black/80'; // 👈 choose based on theme
  const textColor =
    theme === 'dark' ? 'text-neutral-400/70' : 'text-neutral-600/70';

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
