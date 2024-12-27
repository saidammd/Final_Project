import React, { useState } from "react";
import styles from "./SignInForm.module.css";
import { BASE_URL } from '../../../config/index';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSigned, setUser } from "../../../redux/slice";


const SignInForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        alert(`Welcome, ${result.name}!`);
        const coinData = {token: result.newToken, name: result.name}
        console.log(coinData)
        localStorage.setItem("coinData", JSON.stringify(coinData));
        navigate('/');
        dispatch(setUser({name: result.name}))
        dispatch(setSigned(true))
      } else {
        setFormError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setFormError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <h2 className={styles.title}>Sign In</h2>

        {formError && <div className={styles.error}>{formError}</div>}

        <label className={styles.label}>
          Email:
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Password:
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
