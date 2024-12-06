import ImageKit from "imagekit";
import { Router } from "express";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
const router = Router()

const imagekit = new ImageKit({
  publicKey: "public_xyn9SKy/R0uODN6qsmni/yvenv4=", // O'z publicKey'ingizni kiriting
  privateKey: "private_1M+YLEWx7XOcLnDCc47dupEHwTQ=", // O'z privateKey'ingizni kiriting
  urlEndpoint: "https://ik.imagekit.io/njtthrpue", // URL endpoint
});

router.get("/imagekit-auth", verifyAdminOrTeacher, async (req, res) => {
  const authenticationParameters = await imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});



router.post("/upload", verifyAdminOrTeacher, async (req, res) => {
    const { file, fileName } = req.body; // Frontend'dan fayl ma'lumotlarini olish
  
    await imagekit
      .upload({
        file, // Fayl ma'lumotlari (Base64, URL yoki fayl obyekti)
        fileName
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