const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ userName, password: hashPassword });
        req.session.user = user;
        return res.status(200).json({
            status: 'success',
            data: {
                newUser
            }
        })
    } catch (e) {
        return res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
            req.session.user = user;
            return res.status(200).json({
                status: 'success'
            })
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }

    } catch (e) {
        return res.status(400).json({
            status: "fail"
        })
    }
}