$(function(){
    isAdd();
    watch_word(5);
    to_exercise();
    search();
})

// 添加单词
/**
 * 
 * @param {*} btn 单击按钮触发事件
 * @param {*} el 要传递值的元素
 */
function add(btn,en_el,ch_el){
    btn.click(function(){
        if (!btn.hasClass("disabled")){
            let $fail_info=$("[role=fail_alert]");
            // console.log($EN.val());
            // console.log($CH.val());
            if (/[a-zA-Z]+/.test(en_el.val()) && /[\u4e00-\u9fa5]+/.test(ch_el.val())){
                $.ajax({
                    url:"/word/add",
                    data:{en:en_el.val(),ch:ch_el.val()},
                    dataType:"json",
                    type:"get",
                    success(res){
                        if (res.code==1){
                            let $succeed_info=$("[role=succeed_alert]");
                            close_alert($succeed_info,"添加成功");
                            watch_word(5);
                        }else {
                            close_alert($fail_info,"单词已存在，请勿重复添加");
                        }
                    }
                });
            }else {
                close_alert($fail_info,"输入的英语或中文不符合条件");
            }
            en_el.val("");
            ch_el.val("");
            en_el.focus();
            btn.addClass("disabled");
        }
    });
}
// 输入按钮是否可用
/**
 * 
 * @param {*} el 当然输入的input
 */
function ben_whether(el){
    let $add=$("[data-todo=add]");
    el.keyup(function(event){
        if (event.keyCode==13){
            $add.trigger("click");
        }
        for (let i=0;i<$(".input-group-prepend").next().length;i++){
            if ($(`input:eq(${i})`).val()==""){
                $add.addClass("disabled");
                return false;
            }
        }
        $add.removeClass("disabled");
        return true;
    });
}
// 判断是否可以添加
function isAdd(){
    let $EN=$("[aria-label=English]");
    $EN.focus();
    let $CH=$("[aria-label=Chinese]");
    ben_whether($EN);
    ben_whether($CH);
    add($("[data-todo=add]"),$EN,$CH);
}

// 查看所有单词
function watch_word(pageSize){
    let start=0;
    localStorage.setItem("page",start);
    ajax_word(start,pageSize);
}
// 请求单词数据
/**
 * 
 * @param {*} start 第几页
 * @param {*} pageSize 每页的数据量
 */
function ajax_word(start,pageSize){
    $.ajax({
        url:"/word/watch",
        type:"get",
        dataType:"json"
    }).then(function(res){ //成功以后执行
        // console.log(res);
        let $tbody=$("table tbody");
        $tbody.html("");
        let html="";
        let x=0;
        for (let i=start;i<res.length;i++){
            if (x==pageSize){
                break;
            }
            html+=`
                <tr>
                    <td class="align-middle">${i+1}</td>
                    <td class="align-middle">${res[i].en}</td>
                    <td class="align-middle">${res[i].ch}</td>
                    <td data-id="${res[i].id}">
                        <button class="btn btn-info iconfont icon-xiugai" data-toggle='modal' data-target="#exampleModal"></button>
                        <button class="btn btn-danger iconfont icon-Group-" data-todo='del'></button>
                    </td>
                </tr>
            `;
            x++;
        }
        $tbody.append(html);
        get_page_count(Math.ceil(res.length/pageSize));
        // console.log($tbody.html());
        del_btn();
        update_btn();
    });
}

// 删除按钮
function del_btn(){
    // 绑定删除按钮事件
    let $del_btns=$("[data-todo=del]");
    // console.log($del_btns);
    for (let i=0;i<$del_btns.length;i++){
        // console.log(i+1);
        $btn=$($del_btns[i]);
        $id=$btn.parent().attr("data-id");
        del_word($btn,$id);
    }
}

// 更新按钮
function update_btn(){
    let $up_btns=$("[data-toggle=modal]");
    for (let i=0;i<$up_btns.length;i++){
        $btn=$($up_btns[i]);
        $btn.click(function(){
            let $body=$(".modal .modal-body");
            let $CH=$(this).parent().prev();
            let $EN=$CH.prev();
            $id=$(this).parent().attr("data-id");
            $body.html("");
            let html=`
            <div class="input-group pb-3 col-md-8 col-sm-12 m-auto">
                <div class="input-group-prepend">
                    <span class="input-group-text iconfont icon-yingwen"></span>
                </div>
                <input type="text" class="form-control" placeholder="English" aria-label="model_English" aria-describedby="basic-addon3" value="${$EN[0].innerHTML}">
            </div>
            <div class="input-group pb-3 col-md-8 col-sm-12 m-auto">
                <div class="input-group-prepend">
                    <span class="input-group-text iconfont icon-zhongwen"></span>
                </div>
                <input type="text" class="form-control" placeholder="Chinese" aria-label="model_Chinese" aria-describedby="basic-addon4" value="${$CH[0].innerHTML}">
            </div>
            `;
            $body.append(html);
            // 绑定修改确认
            let $btn2=$("[data-todo=update]");
            $btn2.click(function(){
                $new_EN=$(".modal-body input[aria-label=model_English]").val();
                $new_CH=$(".modal-body input[aria-label=model_Chinese]").val();
                update_word($new_EN,$new_CH,$id);
            })
        });
    }
}

// 删除单词
function del_word(el,id){
    el.click(function(e){
        let $target=$(e.target);
        let $EN=$target.parent().prev().prev();
        // console.log($CH,$EN);
        let r=confirm("是否要删除"+$EN.html());
        if (r){
            fetch("/word/del?id="+id).then(function(res){
                return res.json();
            }).then(function(myjson){
                let $succeed_info=$("[role=succeed_alert]");
                close_alert($succeed_info,myjson.msg);
                watch_word(5);
            }).catch(function(myjson){
                let $fail_info=$("[role=fail_alert]");
                close_alert($fail_info,myjson.msg);
            }); 
        }
    });
}

// 更新单词
function update_word(en,ch,id){
    let $close=$("[data-dismiss=modal]");
    $.ajax({
        url:"/word/update",
        type:"get",
        data:{en,ch,id},
        dataType:"json"
    }).then(function(res){
        // 关闭模态框
        $close.click();
        watch_word(5);
        console.log(res.msg);
    }).catch(function(res){
        console.log(res.msg);
    });
    
}

// 跳转练习页面
function to_exercise(){
    $("[data-todo=exercise]").click(function(){
        $(location).attr("href","exercise.html");
    });
}

// 获取分页按钮数量
/**
 * 
 * @param {*} pno 总页数
 */
function get_page_count(pno){
    let $ul=$("ul.pagination");
    $ul.removeClass("d-none").html("");
    let html=`<li class="page-item disabled">
    <a class="page-link" href="javascript:;" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
    </a>
  </li>`;
    for (let i=0;i<pno;i++){
        html+=`<li class="page-item"><a class="page-link" href="javascript:;">${i+1}</a></li>`;
        if(i>4){
            html+=`<li class="page-item"><a class="page-link" href="javascript:;">...</a></li>`;
            html+=`<li class="page-item"><a class="page-link" href="javascript:;">${pno}</a></li>`;
            break;
        }
    }
    html+=`<li class="page-item">
    <a class="page-link" href="javascript:;" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
    </a>
    </li>`;
    $ul.append(html).children(`li:eq(${parseInt(localStorage.getItem("page"))+1})`).addClass("active");
    page_btn(pno);
} 

// 分页按钮
function page_btn(pno){
    let start=localStorage.getItem("page");
    let $previous_btn=$("[aria-label=Previous]");
    let $next_btn=$("[aria-label=Next]");
    ispage($previous_btn,start==0,false);
    ispage($next_btn,start==pno-1,true);
    num_page_btn()
}

/**
 * 
 * @param {*} el 要控制的分页按钮对象
 * @param {*} where 控制按钮是否可用的条件
 * @param {*} isAdd 增加是true,减少是false
 */
// 换页
function ispage(el,where,isAdd){
    let start=localStorage.getItem("page");
    if (where){
        el.parent().addClass("disabled");
    }else {
        el.parent().removeClass("disabled");
    }
    el.click(function(){
        if (!$(this).hasClass("disabled")){
            if (isAdd){
                start++;
            }else {
                start--;
            }
            localStorage.setItem("page",start);
            ajax_word(start*5,5);
        }
    })
}

// 数字按钮
function num_page_btn(){
    let $ul=$("ul.pagination");
    for (let i=1;i<$ul.children().length-1;i++){
        $child=$ul.children(`li:eq(${i})`);
        // console.log($child);
        $child.click(function(){
            let page=$(this).children().html()-1;
            localStorage.setItem("page",page);
            ajax_word(page*5,5);
        })
    }
}

// 模糊搜索
function search(){
    let $btn=$("[data-todo=search]");
    let $val=$("[aria-label=search]");
    $btn.click(function(){
        fetch("/word/search?keyword="+$val.val()).then(function(res){
            return res.json();
        }).then(function(myjson){
            console.log(myjson);
            let $tbody=$("table tbody");
            $tbody.html("");
            let html="";
            if (myjson.code==1){
                for (let i=0;i<myjson.msg.length;i++){
                    html+=`
                    <tr>
                        <td class="align-middle">${i+1}</td>
                        <td class="align-middle">${myjson.msg[i].en}</td>
                        <td class="align-middle">${myjson.msg[i].ch}</td>
                        <td data-id="${myjson.msg[i].id}">
                            <button class="btn btn-info iconfont icon-xiugai" data-todo='updata'></button>
                            <button class="btn btn-danger iconfont icon-Group-" data-todo='del'></button>
                        </td>
                    </tr>
                    `;
                }
                $tbody.append(html);
                get_page_count(Math.ceil(myjson.msg.length/5));
                del_btn();
            }
        })
    })
    $val.keyup(function(event){
        if (event.keyCode==13){
            $btn.trigger("click");
        }
    })
}

//分页隐藏
