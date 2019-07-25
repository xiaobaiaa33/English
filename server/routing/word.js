// 添加依赖
let express=require("express");
let pool=require("../pool");

let router=express.Router();
// 添加
router.get("/add",(req,res)=>{
    let x=req.query;
    console.log(x);
    pool.query("SELECT id,en FROM en_word WHERE en=?",[x.en],(err,result)=>{
        if (err) throw err;
        if (result.length>0){
            res.send({code:0,msg:"已存在"});
        }else {
            pool.query("INSERT INTO en_word SET ?",[x],(err,result)=>{
                if (err) throw err;
                if (result.affectedRows>0){
                    res.send({code:1,msg:"添加成功"});
                }else {
                    res.send({code:0,msg:"添加失败"});
                }
            });
        }
    });
})
// 查看
router.get("/watch",(req,res)=>{
    pool.query("SELECT id,en,ch FROM en_word",(err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});
// 删除
router.get("/del",(req,res)=>{
    let x=req.query;
    pool.query("DELETE FROM en_word WHERE id=?",[x.id],(err,result)=>{
        if (err) throw err;
        if (result.affectedRows>0){
            res.send({code:1,msg:"删除成功"});
        }else {
            res.send({code:0,msg:"删除失败"});
        }
    });
});
//修改
router.get("/update",(req,res)=>{
    let x=req.query;
    // console.log(x.en,x.ch,x.id);
    pool.query("UPDATE en_word SET en=?,ch=? WHERE id=?",[x.en,x.ch,x.id],(err,result)=>{
        if (err) throw err;
        // console.log(result);
        if (result.affectedRows>0){
            res.send({code:1,msg:"更新成功"});
        }else {
            res.send({code:0,msg:"更新失败,请重试!"});
        }
    });
});
// 搜索
router.get("/search",(req,res)=>{
    let keyword=req.query.keyword;
    if (/^[\u4e00-\u9fa5]+$/.test(keyword)){
        pool.query("SELECT id,en,ch FROM en_word WHERE ch LIKE ?",["%"+keyword+"%"],(err,result)=>{
            if (err) throw err;
            res.send({code:1,msg:result});
        });
    }else if(/^[a-zA-Z]+$/.test(keyword)){
        pool.query("SELECT id,en,ch FROM en_word WHERE en LIKE ?",["%"+keyword+"%"],(err,result)=>{
            if (err) throw err;
            res.send({code:1,msg:result});
        });
    }else {
        res.send({code:0,msg:"关键词必须是中文或英文"});
    }
});
// 练习批改
router.get("/ver",(req,res)=>{
    let x=req.query;
    console.log(x);
    pool.query("SELECT id,ch,en FROM en_word WHERE ch=? AND en=?",[x.ch,x.en],(err,result)=>{
        if (err) throw err;
        if (result.length>0){
            res.send({code:1,msg:"回答正确!"});
        }else {
            res.send({code:0,msg:"错了还想下一题!"});
        }
    });
});

module.exports=router;
