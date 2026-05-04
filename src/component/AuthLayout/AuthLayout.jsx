import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import styles from "./AuthLayout.module.css";

export default function AuthLayout() {
  const location = useLocation();
  const isLoginMode = location.pathname === "/login";
  const navigate = useNavigate();

  const toggleMode = () => {
    if (isLoginMode) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div
        className={`${styles.authCard} ${isLoginMode ? styles.loginMode : styles.registerMode}`}
      >
        {/* Image Panel */}
        <div
          className={styles.imagePanel}
          style={{
            backgroundImage: 'url("/assets/library.png")',
          }}
        >
          {/* <div className={styles.leftTop}>
            <span className={styles.logo}>AMU</span>
            <button className={styles.backBtn} type="button">
              ← Back to website
            </button>
          </div>
          <div className={styles.leftBottom}>
            <h1 className={styles.tagline}>
              Capturing Moments,
              <br />
              Creating Memories
            </h1>
            <div className={styles.dots}>
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div> */}
        </div>

        {/* Form Panel */}
        <div className={styles.formPanel}>
          <Outlet context={{ toggleMode, styles }} />
        </div>
      </div>
    </div>
  );
}
