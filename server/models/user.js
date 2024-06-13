const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email must be provided"]
    },
    name: {
      type: String,
      required: [true, "First name must be provided"]
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      select: false // Exclude this field when querying
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      required: [true, "Role must be provided"]
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
