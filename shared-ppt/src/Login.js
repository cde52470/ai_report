// Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("登入成功");
      onSuccess(); // 呼叫父層傳入的跳轉函式
    } catch (err) {
      alert("登入失敗：" + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>登入</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密碼" required />
      <button type="submit">登入</button>
    </form>
  );
}
