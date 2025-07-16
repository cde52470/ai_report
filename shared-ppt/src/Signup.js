import "./Signup.css";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Signup({ onSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("註冊成功！");
      if (onSuccess) onSuccess();
    } catch (error) {
      alert("註冊失敗：" + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>註冊帳號</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="請輸入 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">註冊</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        已有帳號？{" "}
        <span className="link-to-login" onClick={onSwitchToLogin}>
          前往登入
        </span>
      </p>
    </div>
  );
}
