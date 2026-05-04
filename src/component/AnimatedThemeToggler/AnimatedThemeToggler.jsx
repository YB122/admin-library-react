import React, { useEffect, useState, useRef } from 'react';
import styles from './AnimatedThemeToggler.module.css';

const SHAPE_VARIANTS = {
  circle: 'circle',
  square: 'square', 
  rectangle: 'rectangle',
  triangle: 'triangle',
  diamond: 'diamond',
  hexagon: 'hexagon',
  star: 'star'
};

export default function AnimatedThemeToggler({ 
  shape = 'circle',
  duration = 400,
  fromCenter = false,
  size = 48 
}) {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("color-theme") === "dark" ||
      (!localStorage.getItem("color-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  }, [isDark]);

  const calculateShapePath = (shape, x, y, maxRadius) => {
    switch (shape) {
      case SHAPE_VARIANTS.circle:
        return `circle(${maxRadius}px at ${x}px ${y}px)`;
      
      case SHAPE_VARIANTS.square:
        const squareSize = maxRadius * 1.5;
        return `polygon(${x - squareSize}px ${y - squareSize}px, ${x + squareSize}px ${y - squareSize}px, ${x + squareSize}px ${y + squareSize}px, ${x - squareSize}px ${y + squareSize}px)`;
      
      case SHAPE_VARIANTS.rectangle:
        const rectWidth = maxRadius * 2;
        const rectHeight = maxRadius;
        return `polygon(${x - rectWidth}px ${y - rectHeight}px, ${x + rectWidth}px ${y - rectHeight}px, ${x + rectWidth}px ${y + rectHeight}px, ${x - rectWidth}px ${y + rectHeight}px)`;
      
      case SHAPE_VARIANTS.triangle:
        const triangleSize = maxRadius * 1.8;
        return `polygon(${x}px ${y - triangleSize}px, ${x - triangleSize}px ${y + triangleSize}px, ${x + triangleSize}px ${y + triangleSize}px)`;
      
      case SHAPE_VARIANTS.diamond:
        const diamondSize = maxRadius * 1.5;
        return `polygon(${x}px ${y - diamondSize}px, ${x + diamondSize}px ${y}px, ${x}px ${y + diamondSize}px, ${x - diamondSize}px ${y}px)`;
      
      case SHAPE_VARIANTS.hexagon:
        const hexSize = maxRadius * 1.3;
        const hexHeight = hexSize * 0.866;
        return `polygon(${x}px ${y - hexSize}px, ${x + hexHeight}px ${y - hexSize/2}px, ${x + hexHeight}px ${y + hexSize/2}px, ${x}px ${y + hexSize}px, ${x - hexHeight}px ${y + hexSize/2}px, ${x - hexHeight}px ${y - hexSize/2}px)`;
      
      case SHAPE_VARIANTS.star:
        const outerRadius = maxRadius * 1.4;
        const innerRadius = outerRadius * 0.4;
        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          starPoints.push(`${px}px ${py}px`);
        }
        return `polygon(${starPoints.join(', ')})`;
      
      default:
        return `circle(${maxRadius}px at ${x}px ${y}px)`;
    }
  };

  const handleToggle = async (e) => {
    if (isTransitioning) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReduced || !document.startViewTransition) {
      setIsDark(prev => !prev);
      return;
    }

    setIsTransitioning(true);

    try {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      
      let x, y;
      if (fromCenter) {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      } else {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const maxRadius = Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((window.innerWidth - x) ** 2 + y * y),
        Math.sqrt(x ** 2 + (window.innerHeight - y) ** 2),
        Math.sqrt((window.innerWidth - x) ** 2 + (window.innerHeight - y) ** 2)
      );

      const transition = document.startViewTransition(() => {
        setIsDark(prev => !prev);
      });

      await transition.ready;

      const clipPath = calculateShapePath(shape, x, y, maxRadius);
      
      document.documentElement.animate(
        { clipPath: [clipPath, 'inset(0)'] },
        {
          duration,
          easing: shape === SHAPE_VARIANTS.star ? 'linear' : 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)'
        }
      );

      document.documentElement.animate(
        { clipPath: ['inset(0)', clipPath] },
        {
          duration,
          easing: shape === SHAPE_VARIANTS.star ? 'linear' : 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-old(root)'
        }
      );

      transition.finished.finally(() => {
        setIsTransitioning(false);
      });

    } catch (error) {
      console.warn('View transition failed, falling back:', error);
      setIsDark(prev => !prev);
      setIsTransitioning(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      type="button"
      className={styles.themeToggle}
      style={{ width: size, height: size }}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      disabled={isTransitioning}
    >
      <div className={`${styles.toggleIcon} ${isDark ? styles.dark : styles.light}`}>
        <svg 
          className={styles.sunIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
          <path 
            d="M12 1v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        <svg 
          className={styles.moonIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
            fill="currentColor"
          />
        </svg>
      </div>
      {isTransitioning && (
        <div className={styles.transitionIndicator} />
      )}
    </button>
  );
}
