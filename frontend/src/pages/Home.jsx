import React from "react";
import "./Home.css"; 

function Home() {
  return (
    <div className="container hero-fullscreen">
      <div
        className="hero-background"
        style={{
          backgroundImage: "url('/home.jpg')",
        }}
      >
        <div className="hero-filter" />

        <div className="hero-content-wrapper">
          <h1 className="hero-title">
            Dulzura artesanal, tradición rusa y recetas ancestrales
          </h1>

          <div className="hero-divider" />

          <p className="hero-description">
            Somos una empresa familiar que elabora un producto único en
            Argentina: postres tradicionales rusos a base de manzana. Con
            dedicación, recuperamos técnicas antiguas de elaboración artesanal y
            las adaptamos a los tiempos actuales, manteniendo su esencia
            natural y saludable.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
