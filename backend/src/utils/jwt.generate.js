const jwt = require("jsonwebtoken")

const generatetoken = (id,email) => {
    return jwt.sign(
        {
            id, email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '12h'
        }
    )
}

module.exports = generatetoken