import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useOutletContext, useNavigate } from "react-router-dom";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions",
      ),
    role: z.literal("admin"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { toggleMode, styles } = useOutletContext();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    initFlowbite();
    const apiUrl = import.meta.env.VITE_API_URL; // This will be undefined, but that's ok - we'll use proxy
    console.log("API URL from env:", import.meta.env.VITE_API_URL);
    console.log("Final API URL:", apiUrl);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      role: "admin",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const submitData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "admin",
        confirmPassword: data.confirmPassword,
      };
      console.log("API URL from env:", import.meta.env.VITE_API_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        submitData,
      );

      setIsRegistered(true);

      toast.success("Registration successful");

      navigate("/login");
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  const disabled = isRegistered || isSubmitting;

  return (
    <div className={styles.formContainer}>
      {/* Header */}
      <h1 className={styles.formTitle}>Create an account</h1>
      <p className={styles.formSubtitle}>
        Already have an account?{" "}
        <button type="button" onClick={toggleMode}>
          Log in
        </button>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* First + Last name row */}
        <div className={styles.nameRow}>
          <div>
            <input
              type="text"
              id="firstName"
              placeholder="First name"
              disabled={disabled}
              className={styles.input}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className={styles.errorMsg}>{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              id="lastName"
              placeholder="Last name"
              disabled={disabled}
              className={styles.input}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className={styles.errorMsg}>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            disabled={disabled}
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
            disabled={disabled}
            className={`${styles.input} ${styles.inputWithIcon}`}
            {...register("password")}
          />
          <button
            type="button"
            disabled={disabled}
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

        {/* Confirm Password */}
        <div className={styles.inputGroup} style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm your password"
            disabled={disabled}
            className={`${styles.input} ${styles.inputWithIcon}`}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            disabled={disabled}
            className={styles.eyeBtn}
            onClick={() => setShowConfirmPassword((p) => !p)}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <p className={styles.errorMsg}>{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className={styles.termsRow}>
          <input
            type="checkbox"
            id="agreeToTerms"
            disabled={disabled}
            className={styles.checkbox}
            {...register("agreeToTerms")}
          />
          <label htmlFor="agreeToTerms" className={styles.termsLabel}>
            I agree to the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Terms &amp; Conditions
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p
            className={styles.errorMsg}
            style={{ marginTop: -10, marginBottom: 10 }}
          >
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Submit */}
        <button type="submit" disabled={disabled} className={styles.submitBtn}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
