import { useEffect, useState } from 'react';
const cn = (...classes) => classes.filter(Boolean).join(' ');
export const TypeText = ({
  texts,
  typingSpeed = 100,
  pauseDuration = 2000,
  className = '',
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;

    if (isTyping) {
      const targetText = texts[currentTextIndex];
      if (currentText.length < targetText.length) {
        timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        setCurrentTextIndex(prev => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTextIndex,
    isTyping,
    texts,
    typingSpeed,
    pauseDuration,
  ]);

  return (
    <span
      className={cn(
        'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
        className
      )}
    >
      {currentText}
      <span className="animate-pulse text-blue-500">|</span>
    </span>
  );
};
