import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = new Error(
      "Only JPEG, PNG, WebP, and AVIF images are allowed.",
    );
    error.statusCode = 400;
    callback(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadImage = (fieldName = "image") => {
  return upload.single(fieldName);
};
