const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to Database Successfully to: ${conn.connection.host}`)
    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}

module.exports = connectDB;