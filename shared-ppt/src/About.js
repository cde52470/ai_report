// src/About.js
import React from "react";
import "./About.css"; // 如果有 style.css，可以改為用 About.css 分出

export default function About() {
  return (
    <div className="about-container">
      <h1>AI Generated Report</h1>
      <nav>
        <ul>
          <li><a href="#">最新消息</a></li>
          <li><a href="/about">關於我們</a></li>
          <li><a href="#">會員專區</a></li>
          <li><a href="#">關於 AI Report</a></li>
        </ul>
      </nav>

      <main>
        <section>
          <h2>透過 AI，加速你的工作流程</h2>
          <p>
            不需手動編排、不必重複搜尋資料，只要輸入你的需求，AI 將即時生成完整報告，
            讓你專注在更重要的任務上。
          </p>
          <p>
            <a href="/">← 回首頁</a>
          </p>
        </section>
      </main>
    </div>
  );
}
