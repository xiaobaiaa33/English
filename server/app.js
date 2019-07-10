// 创建web服务器
let express=require("express");
// let cors=require("cors");
let Word_router=require("./routing/word");

let server=express();
server.listen(3000,function(){
    console.log("服务器开启，监听3000");
});

// 挂载页面
server.use(express.static("../En"));

// server.use(cors({
//     "origin":["http://localhost:8080","http://127.0.0.1:8080"],
//     "credentials":true
// }));

//挂载路由
server.use("/word",Word_router);