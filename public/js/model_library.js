//页面加载完成，异步请求页头和页尾
$(function(){
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});
//内容显示
(function(){
    //分页码的显示
    function loadProduct(pageNo){
        //发送ajax请求获取当前页内容
        $.ajax({
            type:"GET",
            url:"/modelLibrary",
            data:{pageNo:pageNo},
            success:function(data){
                //console.log(data);
                //将获取的数据显示到页面中
                var html="";
                for(var i=0;i<data.length;i++){
                    var o=data[i];
                    html+=`
                    <li>
                    <div class="model_block_item">
                        <a class="model-block-top" href="model_detail.html">
                            <img class="model_cover" src="${o.picsrcS}" alt="${o.pname}">
                        </a>
                        <div class="model_block_bottom">
                            <a class="model_name" href="" target="_blank">${o.pname}</a>
                            <div class="other-info">
                                <a href="" style="min-width:60px;"><span class="model_icon icon-view"></span><span>${o.pView}</span></a>
                                <a href=""><span class="model_icon icon-comment"></span><span>${o.pComment}</span></a>
                                <a href=""><span class="model_icon icon-like"></span><span>${o.pLike}</span></a>
                                <a href=""><span class="model_icon icon-download"></span><span>${o.pDownload}</span></a>
                            </div>
                        </div>
                    </div>
                </li>
                    `;
                }
                $(".model-block").html(html);
            },
            error:function(){
                alert("网络故障，检查服务器是否打开");
            }
        });
        //发送ajax请求实现分页
        $.ajax({
            type:"GET",
            url:"/productPages",
            success:function(data){
                //总页数
                var p=data.page;
                //拼接页码
                var html="";
                for(var i=1;i<=p;i++){
                    if(i==pageNo){
                        html+=`
                    <li>
                     <span class="current">${i}</span>
                    </li>
                        `;
                    }else{
                        html+=`
                        <li><span>${i}</span></li>
                        `;
                    }
                }
                $(".page-ul").html(html);
            },
            error:function(){
                alert("网络故障，检查服务器是否打开");
            }
        });
    }
    //默认显示第一页
    loadProduct(1);
    //点击某一页时调用分页函数显示该页
    $(".page-ul").on("click","li",function(e){
        $tar=$(e.target);
        var p=parseInt($tar.text());
        loadProduct(p);
    });
    //点击跳转上一页
    $(".prePage").on("click",function(){
        var nowPg=parseInt($(".current").text());
        if(nowPg===1){return}
        else{
            var p=nowPg-1;
            loadProduct(p);
        }
    });
    //点击跳转下一页
    $(".nextPage").on("click",function(){
        var nowPg=parseInt($(".current").text());
        var p=nowPg+1;
        if(p>$(".page-ul li").length){alert("已经是最后一页了");return;}
            loadProduct(p);
    });
})();