// src/Presentation.js
import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./Presentation.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Presentation() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(null);
  const [pages, setPages] = useState([{ text: "" }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filename, setFilename] = useState("presentation");

  //--匯出--
  const exportToPDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");

    for (let i = 0; i < pages.length; i++) {
        const container = document.createElement("div");
        container.className = "slide-canvas export-pdf-mode";

        const inner = document.createElement("div");
        inner.className = "text-box";
        inner.innerText = pages[i].text;

        container.appendChild(inner);
        document.body.appendChild(container);

        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 595.28; // A4 width in pt
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i !== 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 595.28, 841.89);

        document.body.removeChild(container);
    }
    pdf.save(`${filename || "presentation"}.pdf`);
    };
  
  //--更新簡報資訊給firebase------------------
  useEffect(() => {
  async function fetchPresentation() {
    try {
      const q = query(
        collection(db, "presentations"),
        where("code", "==", code)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        setPresentation(snapshot.docs[0].data());

        // 更新 lastAccessBy
        const user = auth.currentUser;
        if (user) {
          await updateDoc(docRef, {
            [`lastAccessBy.${user.uid}`]: Timestamp.now()
          });
        }
      } else {
        alert("找不到該簡報");
        navigate("/create");
      }
    } catch (error) {
      console.error("讀取簡報失敗：", error);
    }
  }

  fetchPresentation();
}, [code, navigate]);

  //------------------------
  const handleTextChange = (e) => {
    const newPages = [...pages];
    newPages[currentPage].text = e.target.innerText;
    setPages(newPages);
  };

  const addPage = () => {
    setPages([...pages, { text: "" }]);
    setCurrentPage(pages.length);
  };

  return (
    <div className="presentation-container">
      {presentation ? (
        <>
          <div className="presentation-header">
            <h2>{presentation.title}</h2>
            <p>簡報碼：<strong>{presentation.code}</strong></p>

            <input
                type="text"
                placeholder="輸入檔案名稱"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                style={{ padding: "5px", marginRight: "10px" }}
            />

            <button onClick={exportToPDF}>匯出 PDF</button>
            <button onClick={() => navigate("/create")}>回首頁</button>
          </div>

          <div className="slide-canvas">
            <div
              className="text-box"
              contentEditable
              suppressContentEditableWarning
              onInput={handleTextChange}
            >
              {pages[currentPage].text}
            </div>
          </div>

          <div className="page-thumbnails">
            {pages.map((page, index) => (
              <div
                key={index}
                className={`thumbnail ${index === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(index)}
              >
                <span>{index + 1}</span>
              </div>
            ))}
            <button className="add-page-btn" onClick={addPage}>＋</button>
          </div>
        </>
      ) : (
        <p className="loading">載入中...</p>
      )}
    </div>
  );
}
