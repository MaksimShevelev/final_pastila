import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;
const secret_key = process.env.SECRET_KEY;

const auth = async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ msg: "El usuario es invalido" });
    }

    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk) {
      return response.status(404).json({ msg: "El usuario es invalido" });
    }

    const data = {
  id: user._id,
  email: user.email,
  role: user.role, // 👈 ДОБАВИЛИ
};

    const jwt = jsonwebtoken.sign(data, secret_key, { expiresIn: "1h" });
    response.json({ msg: "Credenciales correctas", token: jwt, user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error en la autorización" });
  }
};

const getUsers = async (request, response) => {
  try {
    const users = await User.find();
    response.status(200).json(users);
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

const getUserById = async (request, response) => {
  const id = request.params.id;

  try {
    const user = await User.findById(id);
    if (user) {
      return response.status(200).json(user);
    } else {
      return response.status(404).json({ msg: "No se encontró el usuario" });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ msg: "Error al obtener el usuario" });
  }
};

const addUser = async (request, response) => {
  try {
    const { name, email, password, role } = request.body;

    if (!name || !email || !password) {
      return response.status(403).json({ msg: "Faltan parametros" });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const avatar = request.file ? `/uploads/${request.file.filename}` : undefined;

const newUser = new User({
  name,
  email,
  password: passwordHash,
  avatar,
  role: role || "user",
});

    await newUser.save();

    response.status(201).json({ msg: "Usuario guardado", data: newUser });
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error al agregar usuario" });
  }
};

const updateUser = async (request, response) => {
  const id = request.params.id;
  try {
    const updatedData = { ...request.body };

    if (updatedData.password) delete updatedData.password;

    if (request.file) {
      updatedData.avatar = `/uploads/${request.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (updatedUser) {
      response.status(200).json({ msg: "Usuario actualizado", data: updatedUser });
    } else {
      response.status(404).json({ msg: "No se encontró el usuario" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error al actualizar el usuario" });
  }
};


const changePassword = async (request, response) => {
  const { userId } = request.params;
  const { oldPassword, newPassword } = request.body;

  if (!oldPassword || !newPassword) {
    return response.status(400).json({ msg: "Faltan parametros" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({ msg: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return response.status(401).json({ msg: "Contraseña antigua incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();

    response.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error al actualizar la contraseña" });
  }
};

const deleteUser = async (request, response) => {
  const id = request.params.id;
  try {
    const status = await User.findByIdAndDelete(id);
    if (status) {
      response.json({ msg: "Usuario eliminado" });
    } else {
      response.status(404).json({ msg: "No se encontró el usuario" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

export { 
  auth, getUsers, getUserById, addUser, 
  updateUser, deleteUser, changePassword 
};
