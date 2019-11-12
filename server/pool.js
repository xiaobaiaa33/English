let mysql=require("mysql");
let pool=mysql.createPool({
    user:"root",
    password:"",
    port:3306,
    database:"en",
    host:"127.0.0.1",
    connectionLimit:10
})

module.exports=pool;

