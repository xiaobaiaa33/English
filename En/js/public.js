// 可关闭的警告框
/**
 * 
 * @param {*} el jQuery元素，要显示隐藏的警告框对象
 * @param {*} val 警告框的内容
 */
function close_alert(el,val){
    el.removeClass("d-none");
    el.html(val);
    setTimeout(function(){
        el.addClass("d-none");
    },2000);
}