import ImageKit from "imagekit";
import multer from "multer";
import { Router } from "express";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
const router = Router()

const upload = multer({
    storage: multer.memoryStorage(), // Faylni xotirada saqlash
});

const imagekit = new ImageKit({
  publicKey: "public_xyn9SKy/R0uODN6qsmni/yvenv4=",
  privateKey: "private_1M+YLEWx7XOcLnDCc47dupEHwTQ=",
  urlEndpoint: "https://ik.imagekit.io/njtthrpue",
});

router.get("/imagekit-auth", verifyAdminOrTeacher,  async (req, res) => {
  const authenticationParameters = await imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

router.post("/upload", verifyAdminOrTeacher, upload.single("file"), async (req, res) => {
    const { file, fileName } = req.body;
  
    await imagekit
      .upload({
        file: file.buffer,   
        fileName: fileName
      })
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.error("Rasm yuklashda xato:", error);
        res.status(500).json({ error: "Rasm yuklashda xato yuz berdi." });
      });
});
export default router