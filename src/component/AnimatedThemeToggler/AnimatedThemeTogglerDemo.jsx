import React, { useState } from "react";
import AnimatedThemeToggler from "./AnimatedThemeToggler";
import styles from "./AnimatedThemeTogglerDemo.module.css";

const SHAPE_OPTIONS = [
  { value: "circle", label: "Circle", icon: "⭕" },
  { value: "square", label: "Square", icon: "⬜" },
  { value: "rectangle", label: "Rectangle", icon: "▭" },
  { value: "triangle", label: "Triangle", icon: "🔺" },
  { value: "diamond", label: "Diamond", icon: "♦️" },
  { value: "hexagon", label: "Hexagon", icon: "⬡" },
  { value: "star", label: "Star", icon: "⭐" },
];

export default function AnimatedThemeTogglerDemo() {
  const [selectedShape, setSelectedShape] = useState("circle");
  const [duration, setDuration] = useState(400);
  const [fromCenter, setFromCenter] = useState(false);
  const [size, setSize] = useState(48);

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoHeader}>
        <h1 className={styles.demoTitle}>Animated Theme Toggler Demo</h1>
        <p className={styles.demoDescription}>
          Experience smooth dark mode transitions with customizable geometric
          shapes
        </p>
      </div>

      <div className={styles.demoContent}>
        <div className={styles.toggleShowcase}>
          <div className={styles.toggleContainer}>
            <AnimatedThemeToggler
              shape={selectedShape}
              duration={duration}
              fromCenter={fromCenter}
              size={size}
            />
          </div>
          <div className={styles.toggleInfo}>
            <h3>Current Configuration</h3>
            <ul className={styles.configList}>
              <li>
                <strong>Shape:</strong> {selectedShape}
              </li>
              <li>
                <strong>Duration:</strong> {duration}ms
              </li>
              <li>
                <strong>From Center:</strong> {fromCenter ? "Yes" : "No"}
              </li>
              <li>
                <strong>Size:</strong> {size}px
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.controlsPanel}>
          <div className={styles.controlGroup}>
            <label htmlFor="shape-grid" className={styles.controlLabel}>
              Shape Variant
            </label>
            <div
              id="shape-grid"
              className={styles.shapeGrid}
              role="group"
              aria-label="Shape variants"
            >
              {SHAPE_OPTIONS.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => setSelectedShape(shape.value)}
                  className={`${styles.shapeButton} ${
                    selectedShape === shape.value ? styles.active : ""
                  }`}
                >
                  <span className={styles.shapeIcon}>{shape.icon}</span>
                  <span className={styles.shapeLabel}>{shape.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="duration-slider" className={styles.controlLabel}>
              Animation Duration: {duration}ms
            </label>
            <input
              id="duration-slider"
              type="range"
              min="200"
              max="1000"
              step="50"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="size-slider" className={styles.controlLabel}>
              Toggle Size: {size}px
            </label>
            <input
              id="size-slider"
              type="range"
              min="32"
              max="64"
              step="4"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <label
              htmlFor="animate-from-center"
              className={styles.checkboxLabel}
            >
              <input
                id="animate-from-center"
                type="checkbox"
                checked={fromCenter}
                onChange={(e) => setFromCenter(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Animate from screen center</span>
            </label>
          </div>
        </div>

        <div className={styles.featuresPanel}>
          <h3 className={styles.featuresTitle}>Features</h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h4>🎨 Multiple Shapes</h4>
              <p>
                7 geometric variants including circle, square, triangle,
                diamond, hexagon, rectangle, and star
              </p>
            </div>
            <div className={styles.featureCard}>
              <h4>⚡ View Transition API</h4>
              <p>Hardware-accelerated animations using modern browser APIs</p>
            </div>
            <div className={styles.featureCard}>
              <h4>🎯 Smart Positioning</h4>
              <p>Animation originates from button position or screen center</p>
            </div>
            <div className={styles.featureCard}>
              <h4>💾 Theme Persistence</h4>
              <p>User preference saved to localStorage for consistency</p>
            </div>
            <div className={styles.featureCard}>
              <h4>♿ Accessibility</h4>
              <p>
                Respects prefers-reduced-motion and includes proper ARIA labels
              </p>
            </div>
            <div className={styles.featureCard}>
              <h4>🔄 Fallback Support</h4>
              <p>
                Gracefully falls back to instant switching on unsupported
                browsers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
