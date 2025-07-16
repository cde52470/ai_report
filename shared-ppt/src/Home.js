//home.js
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  or
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

export default function Home() {
  const [title, setTitle] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  //處理firebse的簡報資訊--------------
  const fetchPresentations = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;

    const q = query(collection(db, "presentations"), 
      where("participants", "array-contains", uid) // 假設你有這欄
    );

    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => ({
      ...doc.data(),
      lastAccessTime: doc.data().lastAccessBy?.[uid]?.toMillis() || 0
    }));

    // 依照最近時間排序（愈新愈前面）
    result.sort((a, b) => b.lastAccessTime - a.lastAccessTime);

    setPresentations(result);
  };

  //確保登入才能建立簡報--------------
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
        participants: [user.uid], 
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

  //處理搜尋簡報--------------
  const handleJoinPresentation = async (e) => {
    e.preventDefault();
    if (!searchCode) return alert("請輸入簡報碼");

    const user = auth.currentUser;
    if (!user) return alert("請先登入");

    try {
      const q = query(collection(db, "presentations"), where("code", "==", searchCode));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const data = snapshot.docs[0].data();
        const existingParticipants = data.participants || [];

        if (!existingParticipants.includes(user.uid)) {
          await updateDoc(docRef, {
            participants: [...existingParticipants, user.uid]
          });
        }

        navigate("/presentation/" + searchCode);
      } else {
        alert("找不到簡報碼，請確認是否正確");
      }
    } catch (error) {
      console.error("搜尋簡報失敗：", error);
      alert("搜尋簡報失敗：" + error.message);
    }
  };

  //別的
  useEffect(() => {
    fetchPresentations();
  }, []);



  
  return (
    <div className="home-container">
      <h2 className="home-title">加入他人簡報</h2>
      <form onSubmit={handleJoinPresentation} className="home-form">
        <input
          type="text"
          placeholder="輸入簡報碼"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="home-input"
        />
        <button type="submit" className="home-button">
          加入簡報
        </button>
      </form>

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
            <p className="presentation-role">
              {item.owner === auth.currentUser?.uid ? "擁有者" : "協作者"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
