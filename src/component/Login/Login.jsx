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
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        data,
      );
      if (res.data.data.role !== "admin") {
        toast.error("You are not authorized to login");
        return;
      }
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
      </form>
    </div>
  );
}
