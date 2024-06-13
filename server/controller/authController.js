const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../common/jwt");

/* checking user already registered using email */
const checkUserAlreadyRegistered = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }
  
      const trimmedEmail = email.trim();
      
      // Regular expression to check for valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
  
      const emailExists = await User.findOne({
        email: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') }
      }).lean();
  
      if (emailExists) {
        return res.status(200).json({ emailExists: true });
      } else {
        return res.status(200).json({ emailExists: false });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  

/* register */
const register = async (email, name, password, role) => {
  try{
    // Check for required fields
    if (!email || !name || !password || !role) {
      return {
          error: "Please fill all required fields!",
          status: 400
      };
    }

    // Validate email and phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email.trim())) {
        return {
            error: "Invalid email format!",
            status: 400
        };
    }

    if (password.length < 8) {
      return {
          error: "Password must be atleast 8 characters long!",
          status: 400
      };
  }

    // Check if user is already registered
    const userAlreadyRegistered = await User.findOne({ email: email.toLowerCase() }).lean();
    if (userAlreadyRegistered) {
        return {
            error: "User already registered with this email!",
            status: 400
        };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role,
    });

    // Save the user to the database
    await user.save();
    const userObject = user.toObject({ getters: true });
    delete userObject.password;

    // Return the created user
    return {
        user : userObject,
        status: 201
    };
  }catch(err){
    return {
      error: err.message,
      status: 500
    };
  }
}

/* login */
const login = async (email, password) => {
    try { 
      if (!email || !password) {
        return {
          error: "Please provide login credentials",
          status: 403
        };
      }
  
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password').lean();
      if (!user) {
        return {
          error: "User does not exist.",
          status: 400
        };
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          error: "Invalid password.",
          status: 400
        };
      }
  
      const token = generateToken(user, process.env.JWT_SECRET);
  
      delete user.password;
      
      return {
        token,
        user,
        status: 200
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500
      };
    }
  };
  

module.exports = {
    checkUserAlreadyRegistered,
    register,
    login
}