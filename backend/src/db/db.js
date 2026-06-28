const mysql = require("mysql2")

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NewPassword123!',
    database: 'zymgo'
})

async function ConnectDB() {
    await conn.connect((err)=>{
        if(err){
            console.log("Connection failed:",err)
            return
        }
        console.log("MySQL Connected")
    })
}


module.exports = ConnectDB