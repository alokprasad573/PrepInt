const multer = require("multer");
const path = require("path");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const fileFilter = (req, file, cb) => {
  const allowedExts = /\.(jpg|jpeg|png|gif|webp)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp"
  ];

  const isValidExt = allowedExts.test(path.extname(file.originalname));
  const isValidMime = allowedMimeTypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, .gif, and .webp images are allowed"), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      cb(null, `user_profile_images/${fileName}`);
    },
  }),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


const generateSignedS3Url = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
    })

    return getSignedUrl(s3, command, { expiresIn: 60 * 60 });
}

module.exports = { upload, generateSignedS3Url };