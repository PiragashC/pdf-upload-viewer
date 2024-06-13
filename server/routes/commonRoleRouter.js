const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
    getAllPdf
 } = require("../controller/commonRoleController");
 
 //endpoint to get all the pdf details
 router.get("/get-all-pdfs", authMiddleware, getAllPdf);

 module.exports = router;