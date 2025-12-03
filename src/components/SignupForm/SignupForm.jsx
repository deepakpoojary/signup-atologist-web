"use client";

import { useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import styles from "./SignupForm.module.scss";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "../svgs";
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

  // validation functions (using fx validation as its simple form)
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

    // clear error when user starts typing
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
    // using MD5 for encryption as commonly expected by PHP backends
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
        // Reset form after successful submit
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
    // placeholder for Google OAuth implementation
    console.log("Google signup clicked");
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
      {/* google Sign Up */}
      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleSignup}
        aria-label="Sign up with Google"
      >
        <GoogleIcon />
      </button>

      <span className={styles.divider}>OR</span>

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

        {/* email Field */}
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

        {/* mobile Field */}
        <div className={styles.formGroup}>
          <label htmlFor="mobile" className={styles.formLabel}>
            Mobile
          </label>
          <div className={styles.mobileInputWrapper}>
            {/* if needed  */}
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

        {/* password Field */}
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

        {/* dob Field */}
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

        {/* agreement Checkboxes */}
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

export default SignupForm;
