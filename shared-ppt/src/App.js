import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Presentation from "./Presentation";
import Home from "./Home";
import HomeLanding from "./HomeLanding";
import About from "./About";


//<Route path="/" element={<HomeLanding />} />    =>首頁設定在HomeLanding.js檔
//<Route path="/login" element={<Login />} />     =>網址的後面/login 是Login.js檔
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLanding />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/create" element={<Home />} />
        <Route path="/presentation/:code" element={<Presentation />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
