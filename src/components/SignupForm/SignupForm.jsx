"use client";

import { useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import styles from "./SignupForm.module.scss";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation functions
  const validators = {
    firstname: (value) => {
      if (!value.trim()) return "First name is required";
      if (value.trim().length < 2)
        return "First name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "First name can only contain letters";
      return "";
    },
    lastname: (value) => {
      if (!value.trim()) return "Last name is required";
      if (value.trim().length < 2)
        return "Last name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "Last name can only contain letters";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return "";
    },
    mobile: (value) => {
      if (!value.trim()) return "Mobile number is required";
      const cleanNumber = value.replace(/\D/g, "");
      if (cleanNumber.length !== 10) return "Mobile number must be 10 digits";
      return "";
    },
    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number";
      return "";
    },
    dob: (value) => {
      if (!value) return "Date of birth is required";
      const dobDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 13) return "You must be at least 13 years old";
      if (age > 120) return "Please enter a valid date of birth";
      return "";
    },
  };

  const validateField = useCallback((name, value) => {
    return validators[name] ? validators[name](value) : "";
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    if (!agreedTerms || !agreedPrivacy) {
      newErrors.agreement =
        "You must agree to Terms of Service and Privacy Policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, agreedTerms, agreedPrivacy, validateField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const encryptPassword = (password) => {
    // Using MD5 for encryption as commonly expected by PHP backends
    return CryptoJS.MD5(password).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const encryptedPassword = encryptPassword(formData.password);

      const params = new URLSearchParams();
      params.append("firstname", formData.firstname.trim());
      params.append("lastname", formData.lastname.trim());
      params.append("email", formData.email.trim());
      params.append("encryptpassword", encryptedPassword);
      params.append("mobile", formData.mobile.replace(/\D/g, ""));
      params.append("dob", formData.dob);

      const response = await fetch(
        "https://atologistinfotech.com/api/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Account created successfully!",
        });
        // Reset form
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          password: "",
          dob: "",
        });
        setAgreedTerms(false);
        setAgreedPrivacy(false);
        setTouched({});
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth implementation
    console.log("Google signup clicked");
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
      {/* Google Sign Up */}
      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleSignup}
        aria-label="Sign up with Google"
      >
        <GoogleIcon />
      </button>

      {/* <div> */}

      <span className={styles.divider}>OR</span>
      {/* </div> */}

      {/* Name Fields */}
      <div style={{ padding: "2px" }}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstname" className={styles.formLabel}>
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className={`${styles.formInput} ${
                errors.firstname && touched.firstname ? styles.error : ""
              }`}
              placeholder="Enter your first name"
              value={formData.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="given-name"
            />
            {errors.firstname && touched.firstname && (
              <span className={styles.formError}>{errors.firstname}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastname" className={styles.formLabel}>
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className={`${styles.formInput} ${
                errors.lastname && touched.lastname ? styles.error : ""
              }`}
              placeholder="Enter your last name"
              value={formData.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="family-name"
            />
            {errors.lastname && touched.lastname && (
              <span className={styles.formError}>{errors.lastname}</span>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`${styles.formInput} ${
              errors.email && touched.email ? styles.error : ""
            }`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {errors.email && touched.email && (
            <span className={styles.formError}>{errors.email}</span>
          )}
        </div>

        {/* Mobile Field */}
        <div className={styles.formGroup}>
          <label htmlFor="mobile" className={styles.formLabel}>
            Mobile
          </label>
          <div className={styles.mobileInputWrapper}>
            {/* <div className={styles.countryCode}>
            <IndiaFlag />
            <span>+91</span>
            <ChevronDown />
          </div> */}
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className={`${styles.formInput} ${styles.mobileInput} ${
                errors.mobile && touched.mobile ? styles.error : ""
              }`}
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="tel"
            />
          </div>
          {errors.mobile && touched.mobile && (
            <span className={styles.formError}>{errors.mobile}</span>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={`${styles.formInput} ${
                errors.password && touched.password ? styles.error : ""
              }`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className={styles.formError}>{errors.password}</span>
          )}
        </div>

        {/* DOB Field */}
        <div className={styles.formGroup}>
          <label htmlFor="dob" className={styles.formLabel}>
            DOB
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className={`${styles.formInput} ${
              errors.dob && touched.dob ? styles.error : ""
            }`}
            placeholder="Enter your dateofbirth"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="bday"
          />
          {errors.dob && touched.dob && (
            <span className={styles.formError}>{errors.dob}</span>
          )}
        </div>

        {/* Agreement Checkboxes */}
        <div className={styles.formAgreement}>
          <span className={styles.agreementTitle}>I agree to</span>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => {
                  setAgreedTerms(e.target.checked);
                  if (e.target.checked && agreedPrivacy) {
                    setErrors((prev) => ({ ...prev, agreement: "" }));
                  }
                }}
              />
              <span className={styles.checkboxCustom}></span>
              <span className={styles.checkboxText}>Terms of Service</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => {
                  setAgreedPrivacy(e.target.checked);
                  if (e.target.checked && agreedTerms) {
                    setErrors((prev) => ({ ...prev, agreement: "" }));
                  }
                }}
              />
              <span className={styles.checkboxCustom}></span>
              <span className={styles.checkboxText}>Privacy Policy</span>
            </label>
          </div>
          {errors.agreement && (
            <span className={styles.formError}>{errors.agreement}</span>
          )}
        </div>

        {/* Submit Status */}
        {submitStatus && (
          <div
            className={`${styles.submitStatus} ${styles[submitStatus.type]}`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
};

// Icon Components
const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
      fill="#4285F4"
    />
    <path
      d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.09H2.18V16.94C3.99 20.53 7.7 23 12 23Z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.09Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.91C6.71 7.31 9.13 5.38 12 5.38Z"
      fill="#EA4335"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
      fill="#9E9E9E"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.37C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
      fill="#9E9E9E"
    />
  </svg>
);

const IndiaFlag = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="5" fill="#FF9933" />
    <rect y="5" width="20" height="5" fill="white" />
    <rect y="10" width="20" height="5" fill="#138808" />
    <circle cx="10" cy="7.5" r="2" fill="#000080" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 10L12 15L17 10H7Z" fill="#666666" />
  </svg>
);

export default SignupForm;
