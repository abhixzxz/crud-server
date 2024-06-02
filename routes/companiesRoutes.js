const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const up_folder = path.join(__dirname, "../storage/app/public");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(up_folder)) {
      fs.mkdirSync(up_folder, { recursive: true });
    }
    cb(null, up_folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post("/addCompany", upload.single("logo"), companyController.addCompany);
router.get("/getAllCompany", companyController.getAllCompany);
router.delete("/deleteCompany/:id", companyController.deleteCompany);
router.put(
  "/updateCompany/:id",
  upload.single("logo"),
  companyController.updateCompany
);

module.exports = router;
