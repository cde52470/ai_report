// HomeLanding.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";

import Signup from "./Signup";
import Login from "./Login";

import "./HomeLanding.css";
Modal.setAppElement("#root"); // for accessibility

export default function HomeLanding() {
  const navigate = useNavigate();
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setSignupOpen(false);
    navigate("/create");
  };

  return (
    <div>
      <header className="header">
        <h1>AI Generated Report</h1>
        <nav className="nav-bar">
          <ul>
            <li>最新消息</li>
            <li><Link to="/about">關於我們</Link></li>
            <li>AI 功能</li>
          </ul>
          <div className="auth-buttons">
            <button onClick={() => setSignupOpen(true)}>Sign Up</button>
            <button onClick={() => setLoginOpen(true)}>Log In</button>
          </div>
        </nav>
      </header>

      <main className="hero">
        <h2>輸入一行字，生成一份專案報告</h2>
        <p><strong>快速輸入，智慧輸出</strong></p>
        <img src="image/477361ca-6d9a-4d06-b53a-6491ea5d8ca1.png" alt="AI 圖示" />
      </main>

      <footer>
        <p>© 2025 AI Generated｜版權所有 All rights reserved.</p>
      </footer>

      {/* 註冊視窗 */}
    <Modal isOpen={isSignupOpen} onRequestClose={() => setSignupOpen(false)}>
        <Signup
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => {
            setSignupOpen(false);
            setLoginOpen(true);
            }}
        />
    </Modal>

    {/* 登入視窗 */}
    <Modal isOpen={isLoginOpen} onRequestClose={() => setLoginOpen(false)}>
    <Login onSuccess={handleLoginSuccess} />
    </Modal>
    </div>
  );
}
