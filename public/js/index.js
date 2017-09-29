//为logo添加鼠标移入时动画
(function(){
    var logo=document.querySelector("#logo img");
    if(logo==null){return;}
    logo.onmouseenter=function(){
        this.className='animated pulse';
    };
    logo.onmouseleave=function(){
        this.className='';
    };
})();
//验证是否登录
$(function(){
    var userName=sessionStorage["uname"];
    if(userName){
        $(".user_count").css({"display":"block","margin-left":"100px"});
        $(".user_name").html(userName);
        $("#login").hide();
        $("#register").hide();
    }
});
//退出登录函数
function exit(){
    sessionStorage.removeItem("uname");
    history.go(0);
}
//banner自动轮播：淡入淡出,添加class “show”实现
(function(){
    var imgs=document.querySelectorAll("#banner .carousel img");
    //如果未查找到轮播图片，就返回，解决其他页面引用index.js时报错问题
    if(imgs.length==0){return};
    var carousel=document.querySelector("#banner .carousel"),
        n=0,//初始化轮播下标的位置
        timer=null,
        dots=document.getElementById("dots");
    //banner轮播
    function bannerPlay(){
        timer=setInterval(function(){
            //找到当前class为show的a，去除其class
            var imgShow=document.querySelector("#banner .carousel>a.show");
            imgShow.className="";
            if(imgShow.nextElementSibling!=null){
                imgShow.nextElementSibling.className="show";
            }else{
                carousel.children[0].className="show";
            }
            n++;
            if(n>imgs.length-1){
                n=0;
            }
            addClassHover();
        },3000);
    };
    //启动轮播
        bannerPlay();
        carousel.onmouseover=function(){
            clearInterval(timer);
            timer=null;
        };
        carousel.onmouseout=function(){
            bannerPlay();
        };
    //鼠标移入焦点时跳转到对应的当前轮播图片
    dots.onmouseover=function(e){
        e.stopPropagation();
        clearInterval(timer);
        timer=null;
        var tar= e.target,
            dotsLis=this.firstElementChild.children;
        for(var i=0,len=dotsLis.length;i<len;i++){
            if(tar==dotsLis[i]){
                n=i;
                //将相应的图片显示
                imgs[i].parentElement.className="show";
                addClassHover();
                //清除其余图片的show
                for(var j=0;j<len;j++){
                    var imgShow=document.querySelectorAll("#banner .carousel>a");
                    if(j!=i){
                        imgShow[j].className="";
                    }
                }
            }
        }
    };
    dots.onmouseout=function(){
        bannerPlay();
    };
    //下标状态跟随当前图片变化
        function addClassHover(){
            var liHover=document.querySelector("#dots li.hover"),
            //查找所有轮播下标dLis
                dLis=document.querySelectorAll("#dots>ul li");
            if(liHover!=null){
                liHover.className="";
            }
            dLis[n].className="hover";
        }

})();
//导航栏下拉菜单
(function(){
    var navLis=document.querySelectorAll("#quoted-price,#business-case,#mh-resource");
    for(var i=0;i<navLis.length;i++){
        navLis[i].onmouseover=function(){
            //找到当前li的子元素的最后一个子元素，设置其显示
            this.firstElementChild.children[1]
                .style.display="block";
            this.firstElementChild.children[0]
                .className="hover";
        };
        navLis[i].onmouseout=function(){
            this.firstElementChild.children[1]
                .style.display="none";
            this.firstElementChild.children[0]
                .className="";
        }
    }
})();
//随着页面滚动，导航栏收窄，回到顶部按钮在右下角出现
//点击回到顶部，动画效果滚回
(function(){
    var toTop=document.querySelector(".toTop");
    var header=document.querySelector("div.header");
    var timer=null;
    window.onscroll=function(){
        var scrollTop=document.documentElement.scrollTop;
        if(scrollTop>800){
            toTop.style.display="block";
        }
        else{
            toTop.style.display="none";
        }
        if(scrollTop>92){
            header.style.padding="9px 50px";
        }
        else{
            header.style.padding="25px 50px";
        }
        toTop.onclick=function(){
            timer=setInterval(function(){
                var backTop=document.documentElement.scrollTop,
                toTopSpeed=backTop/5;
                document.documentElement.scrollTop=backTop-toTopSpeed;
                if(backTop==0){
                    clearInterval(timer);
                    timer=null;
                }
            },30);
        };
    }
})();
//单击或鼠标移入时搜索按钮时搜索框出现，搜索图标变为x
//同时导航栏隐藏
(function(){
    var navlis=document.querySelectorAll(".header-nav>ul>li");
    var asearch=document.querySelector("#search a.search");
    if(asearch==null){return;}
    var close=document.querySelector("#search a.close");
    var searchDisplay=document.querySelector("#search .search-display");
    var inputSearch=document.getElementsByName("search")[0];
    asearch.onclick=function(e){
        e.preventDefault();
        this.style.display="none";
        searchDisplay.style.display="block";
        //导航栏隐藏
        for(var i=0;i<navlis.length;i++){
            navlis[i].style.display="none";
        }
        //点击x号关闭时，导航栏出现
    close.onclick=function(e){
        e.preventDefault();
        searchDisplay.style.display="none";
        asearch.style.display="block";
        for(var i=0;i<navlis.length;i++){
            navlis[i].style.display="block";
        }
    };
        //搜索输入框失去焦点时隐藏，导航栏出现
        inputSearch.onblur=function(){
            searchDisplay.style.display="none";
            asearch.style.display="block";
            for(var i=0;i<navlis.length;i++){
                navlis[i].style.display="block";
            }
        }
    }
})();
//登录按钮功能
//1.弹出登录框
$('header').on('click','#login',function(){
    loginBtn();
});
function loginBtn(){
    $('#bgmask').fadeIn();
    $('#userlogin').fadeIn();
};
//2.关闭登录框
$('#login_close').click(function(){
    $('#bgmask').fadeOut();
    $('#userlogin').fadeOut();
});
//3.登录框手机快捷登录和账号登录切换
$('.login_tab').on('click','li',function(e){
    var $tar=$(e.target);
    $tar.addClass('active')
        .siblings().removeClass('active');
    //如果当前是短信快捷登录
    if($('.login_phone').hasClass('active')){
        $('.login_active').css('left','0');
        $('#phone_login').show();
        $('#account_login').hide();
        $('.auto_login').hide();
    }else{//否则就是账户登录
        $('.login_active').css('left','186px');
        $('#phone_login').hide();
        $('.auto_login').show();
        $('#account_login').show();
    }
});
//登录验证
(function(){
    //查找要验证的输入框
    var txtPhone=document.getElementsByName("login_phone")[0],
        txtCode=document.getElementsByName("login_veri_code")[0],
        txtName=document.getElementsByName("user_name")[0],
        txtPwd=document.getElementsByName("password")[0];
    //获取验证码按钮
    var getCode=document.getElementsByClassName("send_login_veri")[0];
    var loginBtn=document.getElementById("sendlogin");
    var timer=null;
    //输入框获取焦点时，隐藏相应的警告
    txtPhone.onfocus=getFocus;
    txtCode.onfocus=getFocus;
    txtName.onfocus=getFocus;
    txtPwd.onfocus=getFocus;
    function getFocus(){
        this.parentNode.nextElementSibling
        .style.display="none";
    }
    //输入框失去焦点时验证
    function validate(txt,reg){
        var warning=txt.parentNode.nextElementSibling;
        if(txt.value==""){
            warning.innerHTML="*必须填写，不能为空";
            warning.style.display="block";
        }
        if(reg.test(txt.value)){
            warning.innerHTML="OK，格式正确，可以使用";
            warning.style.cssText+=";color:#333;display:block;";
        }
        else{
            warning.style.display="block";
        }
    }
    //手机号码：
    txtPhone.onblur=function(){
        var reg=/^1(3|4|5|7|8)\d{9}$/;
        validate(this,reg);
    }
    //验证码：
    txtCode.onblur=function(){
        var reg=/^\d{6}$/;
        validate(this,reg);
    }
    //用户名：
    txtName.onblur=function(){
        var reg=/^[a-zA-Z0-9\u4e00-\u9fa5_]{2,20}$/;
        validate(this,reg);
    }
    //密码：
    txtPwd.onblur=function(){
        var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
        validate(this,reg);
    }
    //点击立即登录
    loginBtn.onclick=function(){
        var n=txtName.value,
            p=txtPwd.value;
        //如果是账号密码登录时
        if($(".login_email").hasClass('active')){
            //当姓名和密码框的内容不为空时才发送ajax请求
            if(n!=""&&p!=""){
                $.ajax({
                    type:"POST",
                    url:"/login.do",
                    data:{uname:n,upwd:p},
                    success:function(data){
                        if(data.code>0){
                            sessionStorage.setItem("uid",data.uid);
                            sessionStorage.setItem("uname",data.uname);
                            $('#bgmask').fadeOut();
                            $('#userlogin').fadeOut();
                            $(".user_count").css({"display":"block","margin-left":"100px"});
                            $(".user_name").html(data.uname);
                            $("#login").css("display","none");
                            $("#register").css("display","none");
                        }else{
                            popBox(data.msg+"，请重新填写");
                        }
                    },
                    error:function(){
                        popBox("网络故障，请重试");
                    }
                });
            }
        }
        //否则就是使用手机号登录
        else{
            var up=txtPhone.value,code=txtCode.value;
            //当手机号和验证码的内容不为空时才发送ajax请求
            if(up!=""&&code!=""){
                $.ajax({
                    type:"POST",
                    url:"/phonelogin.do",
                    data:{uphone:up,ucode:code},
                    success:function(data){
                        if(data.code>0){
                            sessionStorage.setItem("uid",data.uid);
                            sessionStorage.setItem("uname",data.uphone);
                            $('#bgmask').fadeOut();
                            $('#userlogin').fadeOut();
                            $(".user_count").css({"display":"block","margin-left":"100px"});
                            $(".user_name").html(data.uphone);
                            $("#login").css("display","none");
                            $("#register").css("display","none");
                        }else{
                            popBox(data.msg+"，请重新填写");
                        }
                    },
                    error:function(){
                        popBox("网络故障，请重试");
                    }
                });
            }
        }
    }
    //弹出框
    function popBox(ptip){
        mCode=ptip;
        codeShow();
        timer=setTimeout(codeHide,2500);
    }
    //生成6位随机验证码：
    var mCode="";
    getCode.onclick=function(){
        for(var i=0;i<6;i++){
            mCode+=Math.floor(Math.random()*10);
        }
        //发送验证码到服务器
        var up=txtPhone.value,
            reg=/^1(3|4|5|7|8)\d{9}$/;
        if(up!=""&&reg.test(up)){
            $.ajax({
                type:"POST",
                url:"/valicode",
                data:{uphone:up,valicode:mCode},
                success:function(data){
                    if(data.code>0)
                        codeShow();
                    timer=setTimeout(codeHide,2000);
                },
                error:function(){
                    popBox("网络故障，请重试");
                }
            });
        }else{
            popBox("手机格式不正确，请重新输入");
        }
    }
    var smask=document.getElementsByClassName("smask")[0],
        veriCode=document.getElementsByClassName("veri_code")[0],
        codeMsg=veriCode.firstElementChild;
    //定义验证码弹出框显示的函数
    function codeShow(){
            codeMsg.innerHTML=mCode;
            smask.style.display="block";
            veriCode.style.display="block";
    }
    function codeHide(){
        mCode="";
        smask.style.display="none";
        veriCode.style.display="none";
        clearTimeout(timer);
        timer=null;
    }
})();
//合作伙伴图片轮播
(function(){
    var n=0,//初始化图片位置
        parterCarousel=document.querySelector(".parter-carousel"),
        parterDots=document.querySelector(".parter-dots"),
        lis=document.querySelectorAll("div.parter-carousel .img-box>li"),
        imgBox=document.querySelector("div.parter-carousel .img-box"),
        timer=null;
//图片显示区的宽度
    if(parterCarousel==null){return};
    pWidth=parseFloat(parterCarousel.offsetWidth);
    //图片自动轮播
    function autoPlay(){
        timer=setInterval(function(){
            n++;
            imgBox.style.left=-n*pWidth+"px";
            if(n>lis.length-1){
                n=0;
                imgBox.style.left=0;
            };
            dotsHover();
        },2000);
    };
    autoPlay();
    imgBox.onmouseover=function(){
        clearInterval(timer);
        timer=null;
    };
    imgBox.onmouseout=function(){
        autoPlay();
    };
    //鼠标移入焦点上时切换到对应的图片
    parterDots.onmouseover=function(e){
        clearInterval(timer);
        timer=null;
        var tar=e.target,
            dLis=this.firstElementChild.children;
        for(var i=0,len=dLis.length;i<len;i++){
            if(tar==dLis[i]){
                n=i;
                imgBox.style.left=-n*pWidth+"px";
                dotsHover();
            }
        };
    };
    parterDots.onmouseout=function(){
        autoPlay();
    };
    //焦点跟着对应的图片切换
    function dotsHover(){
        liHover=document.querySelector(".parter-dots li.hover");
        dotsLis=document.querySelectorAll(".parter-dots li");
        //如果焦点li有class，就清空
        if(liHover!=null){
            liHover.className="";
        }
        dotsLis[n].className="hover";
    };
})();