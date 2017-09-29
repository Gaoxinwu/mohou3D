//页面加载完成，异步请求页头和页尾
$(function(){
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});
//注册验证
(function(){
    //查找每个输入框
    //用户名：
    var txtName=document.getElementsByClassName("member_truename")[0];
    //手机号
    var txtPhone=document.getElementsByClassName("phone")[0];
    //短信验证码
    var txtMsg=document.getElementsByClassName("input_verification")[0];
    var btnSendMsg=document.getElementsByClassName("send_verification")[0];
    //密码：
    var txtPwd=document.getElementsByClassName("password")[0];
    //确认密码：
    var txtRePwd=document.getElementsByClassName("repassword")[0];
    //立即注册按钮:
    var registBtn=document.getElementsByClassName("regist_btn")[0];
    //定义验证函数
    function validate(txt,reg){
        var tips=txt.parentNode.lastElementChild,
            icon=tips.children[0],
            msg=tips.children[1];
        if(txt.value==""){
            icon.className="icon icon_error";
            msg.innerHTML="必须填写，不能为空";
            tips.style.display="block";
            //registBtn.disabled=true;
        }
        if(reg.test(txt.value)){
            icon.className="icon icon_success";
            msg.innerHTML="可以使用";
            tips.style.display="block";
            registBtn.disabled=false;
        }else{
            icon.className="icon icon_error";
            tips.style.display="block";
            registBtn.disabled=true;
        };
    }
    //用户名验证
    txtName.onblur=function(){
        var reg=/^[a-zA-Z0-9\u4e00-\u9fa5_]{2,20}$/;
        validate(this,reg);
        //到数据库验证用户是否可用
        $.ajax({
            url:"/valiuname",
            data:{uname:txtName.value},
            success:function(data){
                if(data.code===-1){
                    $(".unameTip").html(data.msg).prev().removeClass("icon_success").addClass("icon_error");
                }
            },
            error:function(){
                alert("网络出现故障，请稍后");
            }
        });
    }
    //手机号验证
    txtPhone.onblur=function(){
        var reg=/^1(3|4|5|7|8)\d{9}$/;
        validate(this,reg);
    }
    //短信验证码
    txtMsg.onblur=function(){
        var reg=/^\d{6}$/;
        validate(this,reg);
    }
    //密码：
    txtPwd.onblur=function(){
        var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
        validate(this,reg);
    }
    //确认密码：
    txtRePwd.onblur=function(){
        var firstPwd=txtPwd.value;
        if(firstPwd!=""&&firstPwd==this.value){
            var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
            validate(this,reg);
        }
        else{
            this.parentNode.lastElementChild
                .style.display="block";
        }
    };
    registBtn.onclick=function(){
        if(txtName.value!=""&&txtPhone.value!=""&&txtPwd.value!=""&&txtRePwd.value!=""){
            $.ajax({
                type:"POST",
                url:"/reg.do",
                data:{uname:txtName.value,upwd:txtPwd.value,phone:txtPhone.value},
                success:function(data){
                    //console.log(data);
                    if(data.code>0){
                        popBox(data.msg);
                        setTimeout(function(){
                            location.href="../index.html";
                        },3000);
                    }
                },
                error:function(){
                    popBox("出现错误，请重试，可能手机号已被注册");
                }
            });
        }
    }
    //输入框获取焦点时，提示文字隐藏
    //查找提示
    txtName.onfocus=getFocus;
    txtPhone.onfocus=getFocus;
    txtMsg.onfocus=getFocus;
    txtPwd.onfocus=getFocus;
    txtRePwd.onfocus=getFocus;
    //定义获取焦点函数
    function getFocus(){
        var tip=this.parentNode.lastElementChild;
        tip.style.display="none";
    }
//弹出框
    function popBox(ptip){
        mCode=ptip;
        codeShow();
        timer=setTimeout(codeHide,2500);
    }
    //生成模拟验证码
    var mCode="";
    var timer=null;
    btnSendMsg.onclick=function(){
        for(var i=0;i<6;i++){
            mCode+=Math.floor(Math.random()*10);
        }
        codeShow();
        timer=setTimeout(codeHide,2000);
    }
    var smask=document.getElementsByClassName("smask")[0],
        veriCode=document.getElementsByClassName("veri_code")[0],
        codeMsg=veriCode.firstElementChild;
    //定义验证码弹出框显示的函数
    function codeShow(){
        if(txtPhone.value!=""){
            codeMsg.innerHTML=mCode;
            smask.style.display="block";
            veriCode.style.display="block";
        }
    }
    function codeHide(){
        mCode="";
        smask.style.display="none";
        veriCode.style.display="none";
        clearTimeout(timer);
        timer=null;
    }
})();