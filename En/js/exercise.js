$(function(){
    ajax_data("c");
    next_question();
    transform_btn();
});

// 获取所有数据
/**
 * 
 * @param {*} CorE c的时候是显示中文，e的时候显示英文
 */
function ajax_data(CorE){
    $.ajax({
        url:"/word/watch",
        type:"get",
        dataType:"json"
    }).then(function(res){
        console.log(res);
        if (CorE.toLowerCase()=="c"){
            $(".card .card-body .card-text span").html(res[parseInt(Math.random()*res.length)].ch);
        }else if (CorE.toLowerCase()=="e"){
            $(".card .card-body .card-text span").html(res[parseInt(Math.random()*res.length)].en);
        }
        
    })
}

// 下一题
function next_question(){
    let $ch,$en;
    let $next=$("[data-todo=next]");
    let $err=$("[role=error]");
    let $right=$("[role=right]");
    let $btn=$("[data-todo=transform]");
    $next.click(function(){
        let $html=$(".card .card-body .card-text span");
        let $val=$(".card .card-body .card-text input");
        // 获取中文或英文 文本
        if ($btn.html()=="英译中"){
            $ch=$html.html();
            $en=$val.val();
        }else {
            $en=$html.html();
            $ch=$val.val();
        }
        // console.log($ch,$en);
        $.ajax({
            url:"/word/ver",
            data:{en:$en,ch:$ch},
            dataType:"json",
            type:"get"
        }).then(function(res){
            // console.log(res);
            if (res.code=="0"){
                close_alert($err,res.msg);
                $val.val("");
            }else {
                close_alert($right,res.msg);
                $val.val("");
                if ($btn.html()=="英译中"){
                    ajax_data("c");
                }else {
                    ajax_data("e");
                }
            }
        });
    });
    // 回车就是下一题
    $(window).keyup(function(event){
        if (event.keyCode==13){
            $next.trigger("click");
        }
    })
}

//转换按钮
function transform_btn(){
    let $btn=$("[data-todo=transform]");
    $btn.click(function(){
        if ($btn.html()=="英译中"){
            transform_text("中译英","英译中","e","请输入对应的中文");
        }else {
            transform_text("英译中","中译英","c","请输入对应的英文");
        }
    });
}

// 转换文本
function transform_text(btn_text,title_text,lang,input_text){
    let $btn=$("[data-todo=transform]");
    let $title=$(".card-title");
    $btn.html(btn_text);
    $title.html(title_text);
    ajax_data(lang);
    $(".card .card-body .card-text input").attr("placeholder",input_text);
}