const { Schema, model } = require("mongoose");

const pdfSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id must be provided"]
    },
    pdfUrl: {
      type: String,
      required: [true, "PDF url must be provided"]
    },
    fileName: {
      type: String,
      required: [true, "PDF name must be provided"]
    },
    uploadedDate: {
      type: String,
      required: [true, "Uploaded date must be provided"]
    },
    fileSize: {
      type: String,
      required: [true, "PDF size must be provided"]
    }
  },
  { timestamps: true }
);

module.exports = model("Pdf", pdfSchema);
