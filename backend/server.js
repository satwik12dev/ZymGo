const route = require("./src/route")
const conn = require("./src/db/db")
conn()
route.listen(3000, (req,res) =>{
    console.log("Server running on port 3000")
})