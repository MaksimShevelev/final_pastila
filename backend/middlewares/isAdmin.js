import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Acceso solo para admin" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};