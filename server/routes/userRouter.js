const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Multer = require("multer");
const path = require("path");

const { 
   uploadPdf
 } = require("../controller/userController");

// Storage configuration
const pdfStorage = Multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "..", "public", "files", "pdf"));
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
 });
 
 // File filter to accept only PDF files
 const pdfFileFilter = (req, file, cb) => {
     if (file.mimetype === 'application/pdf') {
         cb(null, true);
     } else {
         cb(new Error('Only PDF files are allowed!'), false);
     }
 };
 
 // Upload middleware with file size limit and file filter
 const upload = Multer({ 
     storage: pdfStorage,
     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
     fileFilter: pdfFileFilter
 }).single('pdf');
 
 // Custom error handling middleware for file upload
 const uploadPdfMiddleware = (req, res, next) => {
     upload(req, res, function(err) {
         if (err instanceof Multer.MulterError) {
             if (err.code === 'LIMIT_FILE_SIZE') {
                 return res.status(400).json({ error: 'File size exceeds 5MB limit' });
             }
         } else if (err) {
             return res.status(400).json({ error: err.message });
         }
         next();
     });
 };
 
router.post("/upload-pdf", uploadPdfMiddleware, uploadPdf);

 module.exports = router;