const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const {
  upload,
  generateSignedS3Url,
} = require("../middlewares/upload.middleware");

const router = express.Router();

//Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const key = req.file.key;
    const signedUrl = await generateSignedS3Url(key);

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: signedUrl,
    });
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
