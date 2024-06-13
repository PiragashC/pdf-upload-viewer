const Pdf = require("../models/pdf");
const { generateToken, decodeToken } = require("../common/jwt");
const { register, login } = require("./authController");
const dotenv = require('dotenv');

// // Load environment variables from .env file
dotenv.config();

/* create a document for an order */
const uploadPdf = async (req, res) => {
    try {
        const { email, name, password, accessToken, registeredStatus, role } = req.body;
        let user;
        let token;

        if (accessToken) {
            try {
                user = await decodeToken(accessToken, process.env.JWT_SECRET);

                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                if (user.role !== "User") {
                    return res.status(403).json({ error: "User is not authorized to upload PDF file" });
                }

                token = accessToken;
            } catch (error) {
                return res.status(401).json({ error: "Invalid token" });
            }
        } else if (registeredStatus) {
            const result = await login(email, password);

            if (result.status !== 200) {
                return res.status(result.status).json({ error: result.error });
            }

            user = result.user;

            if (user.role !== "User") {
                return res.status(403).json({ error: "User is not authorized to upload PDF file" });
            }

            token = result.token;
        } else {

            if ( role !== "User" ) {
                return res.status(403).json({ error: "User is not authorized to upload PDF file" });
            }

            const result = await register(email, name, password, role);

            if (result.status !== 201) {
                return res.status(result.status).json({ error: result.error });
            }

            user = result.user;
            token = generateToken(user, process.env.JWT_SECRET);
        }

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || "http://localhost:5001";
            const newPdfFile = new Pdf({
                userId: user.id || user._id,
                pdfUrl: `${serverUrl}/files/pdf/${req.file.filename}`,
                fileName: req.file.originalname,
                uploadedDate: formatDate(new Date()),
                fileSize: `${(req.file.size / 1024).toFixed(2)} KB`
            });
            await newPdfFile.save();
            return res.status(201).json({
                message: 'Pdf file uploaded successfully!',
                file: newPdfFile.toObject(),
                user,
                token
            });
        } else {
            return res.status(400).json({ error: "No PDF file provided" });
        }
    } catch (error) {
        console.error(error); // Log the error to console for debugging
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  uploadPdf
};


