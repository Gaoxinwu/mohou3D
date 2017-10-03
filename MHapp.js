const http=require("http");
const express=require("express");
const qs=require("querystring");
const mysql=require("mysql");
//创建连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"mohou",
    port:"3306",
    connectionLimit:20
});
//创建服务器并监听端口
var app=express();
var server=http.createServer(app);
server.listen(8081);
//express.static若客户端请求了/public目录下的某个资源，可直接向客户端返回该资源，不会再调用后续的路由。
app.use(express.static("public"));
//用户注册
app.post("/reg.do",(req,res)=>{
    req.on("data",(data)=>{
        var str=data.toString();
        var obj=qs.parse(str);
        var u=obj.uname,p=obj.upwd,ph=obj.phone;
        pool.getConnection((err,conn)=>{
            var sql="INSERT INTO mh_user VALUES(null,?,?,?,null)";
            conn.query(sql,[u,ph,p],(err,result)=>{
                if(err) throw err;
                if(result.affectedRows>0){
                    res.json({"code":1,"msg":"注册成功"});
                }
                else{
                    res.json({"code":-1,"msg":"注册失败"});
                }
                conn.release();
            });
        });
    });
});
//验证用户名是否存在
app.get("/valiuname",(req,res)=>{
    var u=req.query.uname;
    pool.getConnection((err,conn)=>{
        var sql="SELECT * FROM mh_user WHERE uname=?";
        conn.query(sql,[u],(err,result)=>{
            if(err) throw err;
            if(result.length<1){
                res.json({"code":1,"msg":"欢迎使用"});
            }
            else{
                res.json({"code":-1,"msg":"该用户名已存在"});
            }
            conn.release();
        });
    });
});
//手机验证码
app.post("/valicode",(req,res)=>{
    req.on("data",(data)=>{
        var str=data.toString();
        var obj=qs.parse(str);
        var code=obj.valicode,phone=obj.uphone;
        pool.getConnection((err,conn)=>{
            //根据手机号查询
            //如果可以查到，就更新，未查到则添加
            var sql="SELECT * FROM mh_user WHERE uphone=?";
            conn.query(sql,[phone],(err,result)=>{
                if(err) throw err;
                if(result.length<1){
                    var sql="INSERT INTO mh_user VALUES(null,null,?,null,?)";
                    conn.query(sql,[phone,code],(err,result)=>{
                        if(err) throw err;
                        if(result.affectedRows>0){
                            res.json({"code":1,"msg":"添加成功"});
                        }
                        else{
                            res.json({"code":-1,"msg":"添加失败"});
                        }
                        conn.release();
                    });
                }else{
                    var sql="UPDATE mh_user SET valicode=? WHERE uphone=?";
                    conn.query(sql,[code,phone],(err,result)=>{
                        if(err) throw err;
                        if(result.affectedRows>0){
                            res.json({"code":1,"msg":"验证码发送成功"});
                        }else{
                            res.json({"code":-1,"msg":"验证码发送失败"});
                        }
                        conn.release();
                    });
                }
            });
        });
    });
});
//用户登录
  //用户名密码登录
app.post("/login.do",(req,res)=>{
    req.on("data",(data)=>{
        var str=data.toString();
        var obj=qs.parse(str);
        var u=obj.uname,p=obj.upwd;
        pool.getConnection((err,conn)=>{
            var sql="SELECT * FROM mh_user WHERE uname=? AND  upwd=?";
            conn.query(sql,[u,p],(err,result)=>{
                if(result.length<1){
                    res.json({"code":-1,"msg":"用户名或密码错误"});
                }else{
                    res.json({"code":1,"msg":"登录成功","uid":result[0].uid,"uname":result[0].uname});
                }
                conn.release();
            });
        });
    });
});
  //手机号和验证码登录
app.post("/phonelogin.do",(req,res)=>{
    req.on("data",(data)=>{
        var str=data.toString();
        var obj=qs.parse(str);
        var up=obj.uphone,c=obj.ucode;
        pool.getConnection((err,conn)=>{
            var sql="SELECT * FROM mh_user WHERE uphone=? AND valicode=?";
            conn.query(sql,[up,c],(err,result)=>{
                if(result.length<1){
                    res.json({"code":-1,"msg":"验证码输入错误"});
                }else{
                    res.json({"code":1,"msg":"登录成功","uid":result[0].uid,"uphone":result[0].uphone});
                }
                conn.release();
            });
        });
    });
});
//当前页内容显示
app.get("/modelLibrary",(req,res)=>{
    var pageNo=req.query.pageNo;
    //目标错误没有输入参数时，指定显示第一页
    if(pageNo==null){pageNo=1;}
    var offset=(pageNo-1)*15;
    pool.getConnection((err,conn)=>{
        var sql="SELECT * FROM lib_list LIMIT ?,?";
        conn.query(sql,[offset,15],(err,result)=>{
            if(err) throw err;
            res.json(result);
            conn.release();
        });
    });
});
//总页数的计算
app.get("/productPages",(req,res)=>{
    pool.getConnection((err,conn)=>{
        var sql="SELECT count(*) AS c FROM lib_list";
        conn.query(sql,(err,result)=>{
            if(err) throw err;
            //将查到的总记录取整
            var p=Math.ceil(result[0].c/15);
            res.json({page:p});
            conn.release();
        });
    });
});
