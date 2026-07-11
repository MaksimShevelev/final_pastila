import express from "express";
import multer from "multer";
import { 
  getUsers, 
  getUserById, 
  addUser, 
  updateUser, 
  deleteUser, 
  auth, 
  changePassword 
} from "../controllers/userController.js";
import { validacionToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

 // только админ


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/auth', auth);

router.put('/:userId/change-password', validacionToken, changePassword);

router.get('/', isAdmin, getUsers);

router.get('/:id', validacionToken, getUserById);

router.post('/', upload.single('avatar'), addUser);

router.put('/:id', validacionToken, upload.single('avatar'), updateUser);

router.delete('/:id', validacionToken, isAdmin, deleteUser);

export default router;
