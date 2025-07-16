import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // ✅ 新增這一行

export default function Home() {
  const [title, setTitle] = useState("");
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  const fetchPresentations = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "presentations"), where("owner", "==", user.uid));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => doc.data());
    setPresentations(result);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return alert("請輸入簡報標題");

    const user = auth.currentUser;
    if (!user) return alert("請先登入");

    const code = uuidv4().slice(0, 6);
    try {
      await addDoc(collection(db, "presentations"), {
        title,
        code,
        owner: user.uid,
        createdAt: Timestamp.now()
      });
      setTitle("");
      await fetchPresentations(); // 重新載入簡報列表
      navigate("/presentation/" + code);
    } catch (error) {
      console.error("建立失敗", error);
      alert("建立失敗：" + error.message);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);



  
  return (
    <div className="home-container">
      <h2 className="home-title">建立新簡報</h2>
      <form onSubmit={handleCreate} className="home-form">
        <input
          type="text"
          placeholder="輸入簡報標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="home-input"
        />
        <button type="submit" className="home-button">
          建立簡報
        </button>
      </form>

      <h3 className="home-subtitle">你的簡報</h3>
      <div className="presentation-grid">
        {presentations.map((item, index) => (
          <div
            key={index}
            className="presentation-card"
            onClick={() => navigate("/presentation/" + item.code)}
          >
            <h4>{item.title}</h4>
            <p>簡報碼：<strong>{item.code}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
