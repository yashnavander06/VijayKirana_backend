const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.Register = async (req, res) => {
  try {
    const { firstName, lastName,password, email,phone } = req.body;

    const existingUser = await User.findOne({ phone});
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email:email || null,
      password,
      phone
    });

    res.status(201).json({ success: true, newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Registration failed' });
  }
};


exports.Login = (req, res) => {
    try {
        User.findOne({ phone: req.body.phone }, (err, user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, same) => {
                    if (same) {
                        const jwt = require('jsonwebtoken');
                        const secret = process.env.JWT_SECRET;
                        // payload includes id and admin flag
                        const payload = { id: user._id ? user._id.toString() : user.id, admin: user.admin === true };
                        const token = jwt.sign(payload, secret, { expiresIn: '7d' });
                        const currentUser = user.toObject ? user.toObject() : user;
                        // remove password before sending
                        if (currentUser.password) delete currentUser.password;
                        res.status(200).json({
                            token,
                            currentUser
                        });
                    } else {
                        res.status(200).json({
                            status: 'failed',
                            error: 'Wrong Phone number or password'
                        });
                    }
                });
            }
            else {
                res.status(200).json({
                    status: 'failed',
                    error: 'Wrong Phone number or password'
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};