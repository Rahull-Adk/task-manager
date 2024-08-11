import { User } from "../models/user.models.js";


export const signUp = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if ([username, fullName, email, password].some((field) => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!regex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const userAlreadyExists = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if(username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters" });
    }
    if(password.length < 6) {
      return res.status(400).json({ message: "Password length must be at least 6 characters" });
    }

    const user = await User.create({
      username, fullName, email, password,
    })

    if(!user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const sendUser = await User.findOne({username: user.username}).select("-password")

    return res.status(201).json({ message: "User created successfully", sendUser});

  } catch (error) {
    console.log(`Error in signUp controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    if(!username || !password) {
      return res.status(400).json({message: "All fields are required"});
    }

    const userCheck = await User.findOne({username});
    if(!userCheck) {
      return res.status(400).json({message: "User does not exists"});
    }

    const passwordCheck = await userCheck.comparePassword(password)
    if(!passwordCheck) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    const token = await userCheck.generateToken();

    const loggedInUser = await User.findOne({username}).select("-password");



    return res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: true,
    }).json({ loggedInUser, message: "Logged in successfully" })

  } catch(error) {
    console.error(`Error in login controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const logout = async (req, res) => {
  return res.status(200).clearCookie("token").json({message: "Logged out successfully"})
}