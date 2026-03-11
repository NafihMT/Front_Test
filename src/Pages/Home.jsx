import React, { useContext } from 'react';
import '../Css/Home.css';
import Navbar from '../Components/NavBar/Navbar';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../Components/CartContext/CartContext';

function Home() {
  const { user } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div>
      <div className="home-main-container" style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="main-body" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh"
        }}>
          <div className="welcome-message" style={{ marginBottom: "20px" }}>
            <div className="welcome-message" style={{ marginBottom: "20px" }}>
              {user ? (
                <h1 style={{ fontWeight: 700, fontSize: "2.2rem", letterSpacing: "2px" }}>
                  HI {user.username?.toUpperCase()}
                </h1>
              ) : (
                <h1 style={{ fontWeight: 700, fontSize: "2.2rem", letterSpacing: "2px" }}>
                  WELCOME GUEST
                </h1>
              )}
            </div>
          </div>
          <div className="helmet-hero" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
            position: "relative"
          }}>
            <img
            className='Image'
              // onClick={() => navigate("/products/11")}
              onClick={() => navigate("/store")}

              // src="https://vegaauto.com/wp-content/uploads/2024/07/Captain-America-2-1024x1024.png"
              src="src\Bg\close-up-motorcycle-helmet-removebg-preview.png"
              alt="Helmet"
              style={{
                width: "340px",
                height: "auto",
                zIndex: 2,
                filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))",
                cursor: "pointer"
              }}
            />
            <span style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'Press Start 2P', 'monospace', 'Courier New', monospace",
              fontSize: "5vw",
              color: "#222",
              opacity: 0.12,
              letterSpacing: "0.2em",
              zIndex: 1,
              userSelect: "none",
              whiteSpace: "nowrap"
            }}>
              H E L M E T
            </span>
          </div>
          <button className='explore-btn'
            onClick={() => navigate("/store")}
            style={{
              padding: "14px 38px",
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              letterSpacing: "1px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#444"}
            onMouseOut={e => e.currentTarget.style.background = "#222"}
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;