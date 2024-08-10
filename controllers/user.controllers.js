import { User } from "../models/user.models.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import * as fs from "node:fs";
import { v2 as cloudinary } from "cloudinary";

export const updateUser = async (req, res) => {
    try {
        const { username, email, fullName, oldPassword, newPassword } = req.body;
        const avatar = req.file;
        const userId = req.params.id;

        const user = await User.findById(userId).populate("tasks");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.user.id !== userId) {
            return res.status(403).json({ message: "You do not have permission to edit this user" });
        }

        if (username && username !== user.username) {
            if (username.length <= 4) {
                return res.status(400).json({ message: "Invalid Username: Username must be longer than 4 characters" });
            }
            const userCheck = await User.findOne({ username });
            if (userCheck) {
                return res.status(400).json({ message: "Username is already taken" });
            }
            user.username = username;
        } else if (username === user.username) {
            return res.status(400).json({ message: "Username cannot be the same as the current one" });
        }

        if (fullName && fullName !== user.fullName) {
            user.fullName = fullName;
        } else if (fullName === user.fullName) {
            if (fullName) {
                return res.status(400).json({ message: "Full name cannot be the same as the current one" });
            }
        }

        if (email && email !== user.email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email)) {
                return res.status(400).json({ message: "Invalid email address" });
            }
            const emailCheck = await User.findOne({ email });
            if (emailCheck) {
                return res.status(400).json({ message: "Email is already taken" });
            }
            user.email = email;
        } else if (email === user.email) {
            return res.status(400).json({ message: "Email cannot be the same as the current one" });
        }

        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Enter both old and new password" });
            }
            if (oldPassword === newPassword) {
                return res.status(400).json({ message: "New password should not be the same as the old password" });
            }
            const passwordCheck = await user.comparePassword(oldPassword);
            if (!passwordCheck) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            user.password = newPassword;
        }

        if (avatar) {
            if (user.avatar) {
                const publicId = user.avatar.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const avatarUrl = await cloudinaryUpload(avatar.path);
            if (!avatarUrl) {
                await fs.unlink(avatar.path, (error) => console.log(error));
                return res.status(500).json({ message: "Internal server error" });
            } else {
                user.avatar = avatarUrl;
                await fs.unlink(avatar.path, (error) => console.log(error));
            }
        }

        await user.save();
        user.password = null;
        return res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        console.log(`Error in updateUser controller: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserProfile = async (req, res) => {
    try{
        const {username} = req.params;
        const user = await User.findOne({username}).select("-password")
        if (!user) return res.status(404).json({message: "User not found"})

        return res.status(200).json(user)
    }
    catch(error) {
        console.log(`Error in getUserProfile controller: ${error}`)
        return res.status(500).json({message: "Internal Server Error"})
    }

}