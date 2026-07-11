import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


import Home from "./pages/Home";
import UserCreate from "./pages/UserCreate";
import NotFound from "./pages/NotFound";
import UserLogin from "./pages/UserLogin";
import BackendPage from "./pages/BackendPage";
import ProductCardsPage from "./pages/ProductCardsPage";

import "./App.css";

const API_BASE_URL = "http://localhost:3000"; 

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : API_BASE_URL + user.avatar
    : null;

  return (
    <>
      <header className="header d-flex justify-content-between align-items-center p-4">
        <div className="logo-container d-flex align-items-center">
          <img src="/logo.png" alt="Logo" style={{ width: "90px", height: "auto" }} />
        </div>

        <nav>
          <ul className="d-flex gap-3 list-unstyled m-0 align-items-center">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Productos</Link></li>
            {!token && <li><Link to="/nuevo">Registro</Link></li>}
            {!token && <li><Link to="/login">Login</Link></li>}
            {token && (
              <>
                {user?.role === "admin" && (
  <li><Link to="/backend">Admin Panel</Link></li>
)}
                <li>
                  <button onClick={handleLogout} className="nav-link-style" title="Cerrar sesión">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </button>
                </li>


                {avatarUrl ? (
                  <li>
                    <img
                      src={avatarUrl}
                      alt={user.name || "Avatar"}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  </li>
                ) : (
                  <li>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "20px",
                      }}
                      title={user?.name || "User"}
                    >
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCardsPage />} />
          <Route path="/nuevo" element={<UserCreate />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/backend" element={<BackendPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="custom-footer">
        <div className="social-icons">
          <a href="https://www.instagram.com/pastila.ar/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/pastila.ar/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://wa.me/541168369035?text=¡Hola! Me gustaría obtener más información." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>

        <hr className="footer-line" />
        <p className="footer-text">© 2025 <strong>Pastilá</strong></p>
      </footer>
    </>
  );
}

export default App;
