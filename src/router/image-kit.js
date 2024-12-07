import ImageKit from "imagekit";
import { Router } from "express";
import multer from "multer"; // Multerni qo‘shamiz
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

// Multer sozlamalari
const upload = multer({
  storage: multer.memoryStorage(), // Faylni xotirada saqlash
});

const imagekit = new ImageKit({
  publicKey: "public_xyn9SKy/R0uODN6qsmni/yvenv4=",
  privateKey: "private_1M+YLEWx7XOcLnDCc47dupEHwTQ=",
  urlEndpoint: "https://ik.imagekit.io/njtthrpue",
});

router.get("/imagekit-auth", verifyAdminOrTeacher, async (req, res) => {
  const authenticationParameters = await imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

// Fayl yuklash uchun POST endpoint
router.post(
  "/upload",
  upload.single("file"), // Multer bilan faylni olish
  async (req, res) => {
    try {
      // Multerdan olingan fayl
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Fayl taqdim etilmagan." });
      }

      // Faylni ImageKit API'ga yuklash
      const response = await imagekit.upload({
        file: file.buffer, // Faylni buffer formatida yuborish
        fileName: file.originalname, // Fayl nomi
        transformation: [{ width: 360, height: 200, quality: 80 }],
      });

      res.json({ url: response.url }); // Javobni qaytarish
    } catch (error) {
      console.error("Rasm yuklashda xato:", error);
      res.status(500).json({ error: "Rasm yuklashda xato yuz berdi." });
    }
  }
);

export default router;
