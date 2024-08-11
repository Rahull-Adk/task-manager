import {userSocket, io} from "../index.js";
import {Task} from "../models/task.models.js";

export const checkDueDates = async (userId) => {
    try {

        const tasks = await Task.find({ user: userId }).populate("user")
        const now = new Date();
        const threeDayFromNow = new Date(now.getTime() + 3 * 24 * 3600 * 1000)

        tasks.forEach(task => {
            if (new Date(task.dueDate) <= threeDaysFromNow) {
                const socketId = userSocket.get(userId);
                if (socketId) {
                    io.to(socketId).emit('notification', {
                        message: `Task "${task.title}" is due soon!`
                    });
                }
            }
        });
    } catch (error) {
        console.error(`Error in checkDueDates: ${error}`);
    }
};