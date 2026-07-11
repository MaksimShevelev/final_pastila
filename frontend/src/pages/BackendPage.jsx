import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";



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

function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editAvatar, setEditAvatar] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "",
  });

  const [newCategory, setNewCategory] = useState({ name: "" });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

const fetchData = async () => {
  const token = localStorage.getItem("token");

  try {
    const [pRes, cRes, uRes] = await Promise.all([
      fetch(`${apiBaseUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiBaseUrl}/categorys`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiBaseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const pData = pRes.ok ? await pRes.json() : [];
    const cData = cRes.ok ? await cRes.json() : [];
    const uData = uRes.ok ? await uRes.json() : [];

    setProducts(pData);
    setCategories(cData);
    setUsers(uData);

  } catch (err) {
    console.error("Error al cargar datos", err);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      if (newProduct.image) formData.append("image", newProduct.image);

      const res = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Error al agregar el producto");
        return;
      }

      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: null,
        category: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error al agregar el producto", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    try {
      const res = await fetch(`${apiBaseUrl}/categorys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        console.error("Error al agregar categoría");
        return;
      }
      setNewCategory({ name: "" });
      fetchData();
    } catch (err) {
      console.error("Error al agregar categoría", err);
    }
  };

  const handleAddUser = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      if (newUser.avatar) formData.append("avatar", newUser.avatar);

      const res = await fetch(`${apiBaseUrl}/users`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Error al agregar usuario");
        return;
      }

      setNewUser({ name: "", email: "", password: "", avatar: null });
      fetchData();
    } catch (err) {
      console.error("Error al agregar usuario", err);
    }
  };

  const handleDelete = async (endpoint, id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBaseUrl}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al eliminar:", res.status, errorText);
        return;
      }
      fetchData();
    } catch (err) {
      console.error("Error al eliminar", err);
    }
  };

  const handleUpdate = async (endpoint, id, updatedData, imageFile = null) => {
    const token = localStorage.getItem("token");
    const url = `${apiBaseUrl}/${endpoint}/${id}`;
    const isUser = endpoint === "users";
    const imageField = isUser ? "avatar" : "image";

    let body;
    let headers = {};

    if (imageFile) {
      const formData = new FormData();
      for (const key in updatedData) {
        if (key === "password" && (!updatedData[key] || updatedData[key].trim() === ""))
          continue;
        formData.append(key, updatedData[key]);
      }
      formData.append(imageField, imageFile);
      body = formData;
    } else {
      if ("password" in updatedData && updatedData.password.trim() === "") {
        delete updatedData.password;
      }
      body = JSON.stringify(updatedData);
      headers["Content-Type"] = "application/json";
    }

    if (isUser && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers,
        body,
      });

      if (!res.ok) {
        console.error("Error durante la actualización:", await res.text());
        return;
      }
      fetchData();
    } catch (err) {
      console.error("Error durante la actualización", err);
    }
  };


const handleEditProduct = (product) => {
  const categoryId = typeof product.category === "object" && product.category?._id
    ? product.category._id
    : product.category || "";

  setEditingProduct({ ...product, category: categoryId });
  setEditImage(null);
  setShowEditModal(true);
};


  const handleSaveProduct = () => {
    if (!editingProduct) return;

    handleUpdate(
      "products",
      editingProduct._id,
      {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        category: editingProduct.category || "",
      },
      editImage
    );
    setShowEditModal(false);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    handleUpdate("categorys", editingCategory._id, { name: editingCategory.name });
    setShowEditCategoryModal(false);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    handleUpdate(
      "users",
      editingUser._id,
      {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
      },
      editAvatar
    );
    setShowEditUserModal(false);
  };

  const openChangePasswordModal = (userId) => {
    setPasswordUserId(userId);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setShowChangePasswordModal(true);
  };

const handleChangePassword = async () => {
  setPasswordError(null);

  if (!oldPassword.trim()) {
    setPasswordError("La contraseña antigua no puede estar vacía");
    return;
  }
  if (!newPassword.trim()) {
    setPasswordError("La nueva contraseña no puede estar vacía");
    return;
  }
  if (newPassword !== confirmPassword) {
    setPasswordError("Las contraseñas no coinciden");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${apiBaseUrl}/users/${passwordUserId}/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      setPasswordError(`Error: ${errorText}`);
      return;
    }

    setShowChangePasswordModal(false);
    setSuccessMessage("Contraseña cambiada con éxito");
    setTimeout(() => setSuccessMessage(""), 5000);
  } catch (err) {
    setPasswordError("Error en la solicitud");
  }
};

const [successMessage, setSuccessMessage] = useState("");

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container-media py-4">
      <h1 className="text-center m-5">Panel de Administración</h1>

      {showEditModal && editingProduct && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    className="form-control"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    className="form-control"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    value={editingProduct.category || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                  >
                    <option value="">-- Seleccionar categoría --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Imagen</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setEditImage(e.target.files[0])}
                  />
                  {editingProduct.image && !editImage && (
                    <div className="mt-2">
                      <img
                        src={`http://localhost:3000${editingProduct.image}`}
                        alt="Current"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                      <p className="text-muted small mt-1">Imagen actual</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProduct}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditCategoryModal && editingCategory && (
        <Modal
          title="Editar Categoría"
          onClose={() => setShowEditCategoryModal(false)}
          onSave={handleSaveCategory}
        >
          <input
            className="form-control mb-2"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
          />
        </Modal>
      )}

      {showEditUserModal && editingUser && (
        <Modal
          title="Editar Usuario"
          onClose={() => setShowEditUserModal(false)}
          onSave={handleSaveUser}
        >
          <input
            className="form-control mb-2"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />

          <input
            className="form-control mb-2"
            type="file"
            onChange={(e) => setEditAvatar(e.target.files[0])}
          />
        </Modal>
      )}

      {showChangePasswordModal && (
        <Modal
          title="Cambiar Contraseña"
          onClose={() => setShowChangePasswordModal(false)}
          onSave={handleChangePassword}
        >
          <div className="mb-3">
            <label>Contraseña antigua</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="mb-3">
            <label>Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="mb-3">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {passwordError && (
            <div className="alert alert-danger">{passwordError}</div>
          )}
        </Modal>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
<div>
  <button
    className="btn btn-outline-primary me-2"
    onClick={() => setSortOrder("asc")}
  >
    Precio ↑
  </button>
  <button
    className="btn btn-outline-primary me-2"
    onClick={() => setSortOrder("desc")}
  >
    Precio ↓
  </button>
  <button
    className="btn btn-outline-secondary me-2"
    onClick={() => setSortOrder(null)}
  >
    Reset filtro
  </button>
</div>

        </div>
        
      </div>

      <section>
        <h2 className="text-center m-5">Productos</h2>
  <div className="row row-cols-1 row-cols-md-3 g-4">
    {filteredProducts.map((product) => (
      <div className="col" key={getIdString(product._id)}>
        <div className="card h-100">
          {product.image && (
            <img
              src={`http://localhost:3000${product.image}`}
              className="card-img-top"
              alt={product.name}
              style={{ objectFit: "cover", height: "200px" }}
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text fw-bold">${product.price}</p>
            <p className="card-text text-muted">
              Categoría:{" "}
              {categories.find((c) => getIdString(c._id) === getIdString(product.category))?.name ||
                "-"}
            </p>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEditProduct(product)}
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete("products", product._id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  
        <div className="m-5">
          <h4>Agregar Producto</h4>
          <div className="mb-2">
            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              className="form-control mb-2"
              placeholder="Descripción"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, price: e.target.value }))
              }
            />
            <select
              className="form-select mb-2"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">-- Seleccionar categoría --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }))
              }
            />
            <button className="btn btn-success" onClick={handleAddProduct}>
              Agregar Producto
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-center m-5">Categorías</h2>
        <ul className="list-group mb-3">
          {categories.map((cat) => (
            <li
              key={getIdString(cat._id)}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {cat.name}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditingCategory(cat);
                    setShowEditCategoryModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete("categorys", cat._id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mb-5">
          <h4>Agregar Categoría</h4>
          <input
            className="form-control mb-2"
            placeholder="Nombre de la categoría"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleAddCategory}>
            Agregar Categoría
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-center m-5">Usuarios</h2>
        <ul className="list-group mb-3">
          {users.map((u) => (
            <li
              key={getIdString(u._id)}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                {u.avatar && (
                  <img
                    src={
                      u.avatar.startsWith("http")
                        ? u.avatar
                        : `http://localhost:3000${u.avatar}`
                    }
                    alt={u.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <div>
                  <strong>{u.name}</strong> - {u.email}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditingUser(u);
                    setEditAvatar(null);
                    setShowEditUserModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openChangePasswordModal(u._id)}
                >
                  Cambiar Contraseña
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete("users", u._id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mb-3">
          <h5>Agregar Usuario</h5>
          <input
            className="form-control mb-2"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            autoComplete="off"
          />
          <input
            className="form-control mb-2"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            autoComplete="off"
          />
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            autoComplete="new-password"
          />
          <input className="form-control mb-2" type="file" onChange={(e) => setNewUser({ ...newUser, avatar: e.target.files[0] })} />
          <button className="btn btn-success" onClick={handleAddUser}>
            Agregar
          </button>
        </div>
      </section>
      {successMessage && (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div className="toast align-items-center text-white bg-success border-0 show" role="alert">
        <div className="d-flex">
          <div className="toast-body">
            {successMessage}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      </div>
    </div>
  )}
    </div>
  );
  
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



export default AdminDashboard;
