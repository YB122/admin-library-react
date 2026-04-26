import { useContext, useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "../../contexts/UserContext";
import { useOutletContext, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { toggleMode, styles } = useOutletContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setUserToken, setUserData, setUserRole } = useContext(User);

  useEffect(() => {
    initFlowbite();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/users/login`,
        data,
      );
      if (res.data.data.role !== "admin") {
        toast.error("You are not authorized to login");
        return;
      }
      setUserRole(res.data.data.role);
      setUserData(res.data.data);
      setUserToken(res.data.token);
      toast.success("Login successful");

      // Redirect to overview page after successful login
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className={styles.formContainer}>
      {/* Header */}
      <h1 className={styles.formTitle}>Welcome back</h1>
      <p className={styles.formSubtitle}>
        Don&apos;t have an account?{" "}
        <button type="button" onClick={toggleMode}>
          Create an account
        </button>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className={styles.inputGroup}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            disabled={isSubmitting}
            className={styles.input}
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.errorMsg}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className={styles.inputGroup} style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            className={`${styles.input} ${styles.inputWithIcon}`}
            {...register("password")}
          />
          <button
            type="button"
            disabled={isSubmitting}
            className={styles.eyeBtn}
            onClick={() => setShowPassword((p) => !p)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <path d="m3 21 18-18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password.message}</p>
          )}
        </div>

        {/* Forgot password */}
        <div className={styles.forgotRow}>
          <a
            href="#"
            className={styles.forgotLink}
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>Or login with</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Social */}
        <div className={styles.socialRow}>
          <button type="button" className={styles.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button type="button" className={styles.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        </div>
      </form>
    </div>
  );
}
