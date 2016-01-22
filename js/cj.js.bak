/**
 * Created by Administrator on 2015/1/19.
 */
var isBegin = false;

var count=0;
function getRandom(n){
    return Math.floor(Math.random()*n+1)
}

$(function(){
    var u = 320;
    var g= 5;
    var gnum=0;
    var slidebox=$('.slide-box');
    var zjArray=$.cookie('zjArray');
    if(zjArray && zjArray.length>0){
        zjArray=zjArray.split(',');
    }else{
        zjArray=new Array();
    }
    //http://qyh.fescoadecco.net/nianhui/qiandao/list
    $.post('data/listall',function(data){
        count=data.result.length;
        gnum=parseInt(count/g);
        
        var user=data.result;
        for(var gi=0;gi<g;gi++){
            for(var i=gi*gnum;i<gi*gnum+gnum;i++){
                if(i<count && zjArray.indexOf(user[i].USERID)==-1){
                    if(user[i].AVATAR_DOWNLOAD=='1'){
                        slidebox.find('ul').eq(gi).append('<li  dataId="'+user[i].USERID+'" dataName='+user[i].NAME+' dataOrg="'+user[i].DEPARTMENT+'"><img src="images/avatar/'+user[i].USERID+'.jpg" class="u-header" /></li>');

                    }else{
                        slidebox.find('ul').eq(gi).append('<li  dataId="'+user[i].USERID+'" dataName='+user[i].NAME+' dataOrg="'+user[i].DEPARTMENT+'"><img src="images/default.png" class="u-header" /></li>');
                    }
                }
            }
        }
        slidebox.each(function(){
            $(this).cxScroll({
                direction:"top",
                step:1,
                speed:20,
                time:20,
                auto:true,
                prevBtn:true,
                nextBtn:true,
                accel:20
            });
        });

    },'json');


    $('.stop-btn').on('click',function(){
        var tempArray=new Array();
        var num=0;
        slidebox.each(function(index){
            num=$(this).find('.box').data('nowNum');
            num=parseInt(num/u-1);
            console.log(num);
            var selectli=$(this).find('li').eq(num);
            $(this).find('.name').html(selectli.attr("dataName"));
            $(this).find('.org').html(selectli.attr("dataOrg"));
            $(this).find('li').eq(num).addClass('zj');
            zjArray.push(selectli.attr("dataId"));
            tempArray.push(selectli.attr("dataId"));
        });
        $.post('http://127.0.0.1/nianhui/qiandao/savewinner',{'userids':tempArray.toString()},function(data){},'json');
        $.cookie('zjArray',zjArray,{ expires: 7, path: '/' });
    });
    $('.start-btn').on('click',function(){
        $('.slide').find('.zj').each(function(){
            var dataid=$(this).attr('dataId');
            $('li[dataId='+dataid+']').remove();
        });
        slidebox.find('.name').html('');
        slidebox.find('.org').html('');
    });
    $(document).keypress(function(e){
        if(e.which == 13 || e.which==32) {
            if(isBegin){
                isBegin=false;
                $('.cxscroll').removeClass('op5');
                if(!document.getElementById('start-mp3').paused) {
                    document.getElementById('start-mp3').pause();
                }
                document.getElementById('stop-mp3').play();
                $('.stop-btn').click();

            }else{
                isBegin=true;
                $('.cxscroll').addClass('op5');
                if(!document.getElementById('start-mp3').paused) {
                    document.getElementById('stop-mp3').pause();
                }
                document.getElementById('start-mp3').play();

                $('.start-btn').click();

            }
        }
    });
});