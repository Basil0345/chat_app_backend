const asyncHandler = require('express-async-handler');
const userModel = require('../Models/userModel');
const generateToken = require('../helpers/generateToken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');


//Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter All the Fields");
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exist");
    }

    const hashedPassword = await hashPassword(password);

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});

//Login User
const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.status(400)
        throw new Error("Please Enter All the Fields");
    }
    const user = await userModel.findOne({ email });

    if (!user) {
        res.status(400).send("Wrong Email or Password")
        throw new Error("Wrong Email or Password");
    }

    let passwordCheck = await comparePassword(password, user.password)

    if (!passwordCheck) {
        res.status(400).send("Wrong Email or Password")
        throw new Error("Wrong Email or Password");
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id)
    })

})

// /api/user?search=basil
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $and: [{ _id: { $ne: req.user._id } },
        {
            $or: [{ name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }]
        }]
    } : { _id: { $ne: req.user._id } }

    const users = await userModel.find(keyword, "-password")
    res.send(users);
})


module.exports = { registerUser, LoginUser, allUsers };