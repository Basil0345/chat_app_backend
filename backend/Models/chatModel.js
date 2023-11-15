const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }

}, { timestamps: true });


const chatModel = mongoose.model('Chat', chatSchema);

module.exports = chatModel;
