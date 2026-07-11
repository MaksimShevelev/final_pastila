import React, { useState, useEffect } from "react";

const apiBaseUrl = "http://localhost:3000/api";

function getIdString(id) {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object") {
    if (id.$oid) return id.$oid;
    if (id.toHexString) return id.toHexString();
    if (id._id) return getIdString(id._id);
  }
  return String(id);
}

const ProductCardsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${apiBaseUrl}/products`),
      fetch(`${apiBaseUrl}/categorys`),
    ])
      .then(async ([pRes, cRes]) => {
        if (!pRes.ok || !cRes.ok) throw new Error("Error al cargar datos");
        const [productsData, categoriesData] = await Promise.all([
          pRes.json(),
          cRes.json(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    console.log("Producto agregado al carrito:", product);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 className="text-center m-5">Productos</h1>
      <div style={styles.cardsGrid}>
        {products.length === 0 && <p>No hay productos disponibles.</p>}
        {products.map((product) => (
          <div key={product._id || product.id} style={styles.card}>
            {product.image && (
              <img
                src={`http://localhost:3000${product.image}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={{ fontSize: "0.9rem", color: "#888" }}>
              Categoría:{" "}
              {
                categories.find(
                  (c) =>
                    getIdString(c._id) === getIdString(product.category)
                )?.name || "Sin categoría"
              }
            </p>
            <p style={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              style={styles.cartButton}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem",
  },
  card: {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    height: "100%",                  
  },
  price: {
    fontWeight: "bold",
    color: "#ff9415",
  },
  cartButton: {
    backgroundColor: "#ff9415",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "auto", 
  },

};

export default ProductCardsPage;
