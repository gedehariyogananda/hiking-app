const User = require('../../../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { name, email_user, password, phone_number_user } = req.body;

        // get all untuk pengecekan exist email jika sudah ada maka salah 
        const checkUser = await User.findOne( { email_user : email_user});

        if(checkUser){
            return res.status(400).json({
                success: false,
                message: "email already exists"
            });
        }

        // hashing 
        const salt = await bcrypt.genSalt(10);
        const hashingPassword = await bcrypt.hash(password, salt);

        // create user password hashing
        const createUser = await User.create({
            name: name,
            email_user: email_user,
            password: hashingPassword,
            phone_number_user: phone_number_user
        });

        if(!createUser){
            return res.status(400).json({
                success: false,
                message: "failed register data"
            });
        }

        return res.status(201).json({
            success: true,
            message: "success register data",
            data: createUser,
        });
        
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "failed register data",
            error: err || "Ada kesalahan"
        });
    }
}

const login = async (req, res) => {
    try {

        const { email_user , password } = req.body;
        
        const existingUser = await User.findOne({ email_user: email_user });

        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "akun belum terdaftar"
            });
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);

        if(!checkPassword){
            return res.status(400).json({
                success: false,
                message: "authenticate salah"
            });
        }

        const token = jwt.sign({
            email_user: existingUser.email_user,
            id: existingUser.id
        }, process.env.JWT_KEY, {
            expiresIn: "365d"
        });

        return res.status(200).json({
            success: true,
            message: "login success",
            user: existingUser,
            authorization : {
                token: token,
                type: "bearer"
            }
        });
        
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "failed login data",
            error: err || "Ada kesalahan"
        });
    }
}

const logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "logout success"
    });
}

module.exports = {
    register,
    login,
    logout
}