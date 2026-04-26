import React, { useEffect, useState } from "react";
import styles from "./ToggleMode.module.css";

export default function ToggleMode() {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("color-theme") === "dark" ||
      (!localStorage.getItem("color-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isBlinking, setIsBlinking] = useState(false);

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

  function handleToggle() {
    if (isBlinking) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setIsDark((prev) => !prev);
      return;
    }

    setIsBlinking(true);
    setTimeout(() => {
      setIsDark((prev) => !prev);
    }, 90);
    setTimeout(() => {
      setIsBlinking(false);
    }, 180);
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={styles.eyeToggle}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <div
        className={`${styles.eye} ${isDark ? styles.eyeDark : ""} ${
          isBlinking ? styles.blinking : ""
        }`}
      >
        <div className={`${styles.sclera} ${isDark ? styles.scleraDark : ""}`}>
          <div className={`${styles.iris} ${isDark ? styles.irisDark : ""}`}>
            <div
              className={`${styles.pupil} ${isDark ? styles.pupilDark : ""}`}
            />
            <div className={styles.highlight} />
          </div>
        </div>
        <div
          className={`${styles.eyelid} ${isDark ? styles.eyelidDark : ""}`}
        />
      </div>
    </button>
  );
}
