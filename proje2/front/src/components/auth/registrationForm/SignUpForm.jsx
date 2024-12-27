import React, { useState } from "react";
import styles from "./SignUpForm.module.css";
import { BASE_URL } from '../../../config/index';
import { useNavigate } from "react-router-dom";


const SignUpForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormSuccess("Registration successful!");
        setFormError("");
        setUserData({ name: "", email: "", password: "" });
        navigate('/login');
      } else {
        setFormError(result.message || "Registration failed.");
        setFormSuccess("");
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.");
      setFormSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <h2>Sign Up</h2>
        {formError && <p className={styles.error}>{formError}</p>}
        {formSuccess && <p className={styles.success}>{formSuccess}</p>}

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
