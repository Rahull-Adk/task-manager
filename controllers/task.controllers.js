import {User} from "../models/user.models.js";
import {Task} from "../models/task.models.js";
import mongoose from "mongoose";
import moment from "moment";

const isDueSoon = async (dueDate) => {
    const now = moment();
    const due = moment(dueDate);
    const dayUntilDue = due.diff(now, "days");
    return dayUntilDue <= 3
}

export const getMyTasks = async (req, res) => {
    const { id } = req.params;
    const { filterBy } = req.body;

    // Fetching all tasks for the user
    let tasks = await Task.find({ user: id });

    if (filterBy === "date") {
        // Sorting by creation date (newest first)
        tasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterBy === "dueDate") {
        // Sorting by due date (earliest first)
        tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return res.status(200).json({ tasks });
};
export const createTask = async (req, res) => {
    try {
        const {id} = req.user;
        const user = await User.findById(id);
        const {title, description, status, dueDate } = req.body;
        if(!title || !description ){
            return res.status(400).json({message: "Title and description are required"})
        }
        if (!user) return res.status(404).json({message: "User not found"});
        const newTask = await Task.create({
         user: user._id , title, description, status, dueDate
        });
        if(!newTask) return res.status(500).json({message: "Task creation failed"});
        const populatedTask = await Task.findById(newTask._id).populate("user", ("username", "email"));

        return res.status(201).json({newTask: populatedTask, message: "Task created successfully"});
    }
    catch (error) {
        console.log(`Error in createTask controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    };
};
export const deleteTask = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;
        const task = await Task.findById(id);
        if(!task) return res.status(404).json({message: "Task not found"});
        if(task.user._id.toString() !== userId) return res.status(403).json({message: "You do not have the permission to delete this task"});

        await Task.findByIdAndDelete(id);

        return res.status(200).json({message: "Task deleted successfully"});

    } catch(error) {
        console.log(`Error in deleteTask controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const editTask = async (req, res) => {

    try {
        const {title, description, status, dueDate} = req.body;
        if(!title && !description && !status && !dueDate) {
            return res.status(400).json({message: "Atleast one field should be edited"})
        }
        const {id} = req.params;
        const userId = req.user.id;
        const task = await Task.findById(id);
        if(!task) return res.status(404).json({message: "Task not found"});
        if(task.user._id.toString() !== userId) return res.status(403).json({message: "You do not have the permission to edit this task"});
        const updateFields = {};

        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (status) updateFields.status = status;
        if (dueDate) updateFields.dueDate = dueDate;

        const editedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });

        return res.status(200).json({message: "Task edited successfully", editedTask });
    }
    catch(error) {
        console.log(`Error in editTask controller: ${error}`);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getAllTask = async (req, res) => {
    const tasks = await Task.find().sort({createdAt: -1}).populate({path: "user", select: "-password"});
    if(tasks.length < 1) return res.status(200).json({});

    return res.status(200).json({tasks});
};