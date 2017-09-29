//页面加载完成，异步请求页头和页尾
$(function(){
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});
//鼠标移入缩略图时显示相应的大图
(function(){
    var n=0,//初始化图片位置
        timer=null,
        cImgs=document.querySelectorAll(".carousel img"),
        carousel=document.querySelector(".carousel"),
        carouselBox=document.querySelector(".carousel-box"),
        imgThumbs=document.querySelector(".img-thumb");
        cWidth=parseFloat(carouselBox.offsetWidth);
    //自动轮播
    function autoPlay(){
        timer=setInterval(function(){
            n++;
            if(n>cImgs.length-1){
                n=0;
            }
            carousel.style.left=-n*cWidth+"px";
        },2000);
    }
    autoPlay();
    carouselBox.onmouseover=function(){
        clearInterval(timer);
        timer=null;
    };
    carouselBox.onmouseout=function(){
        autoPlay();
    };
    //鼠标移入缩略图时
    imgThumbs.onmouseover=function(e){
        e.stopPropagation();
        clearInterval(timer);
        timer=null;
        var tar=e.target;
        for(var i=0;i<cImgs.length;i++){
            if(tar==this.children[i].firstElementChild){
                n=i;
                carousel.style.left=-n*cWidth+"px";
            }
        }
    };
    imgThumbs.onmouseout=function(){
        autoPlay();
    }
})();


