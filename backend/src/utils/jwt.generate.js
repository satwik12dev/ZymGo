const jwt = require("jsonwebtoken")

const generateToken = (id, email, role_id, role_name) => {
    return jwt.sign(
        {
            id , email, role_id, role_name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h"
        });
}

module.exports = generateToken