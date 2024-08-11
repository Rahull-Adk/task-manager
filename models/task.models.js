import mongoose, {Schema} from 'mongoose';

// Define the schema for the task
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    commentedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'inProgress', 'completed'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);

