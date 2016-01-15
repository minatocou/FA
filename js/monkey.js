
(function(){
    var SHAKE_THRESHOLD=800;
    var last_update = 0;
    var num=0;
    var time=15;
    var x, y, z, last_x=0, last_y=0, last_z=0;
    var use=true;
    var cd=true;
    var zz=true;
    //setInterval(function(){
    //    num++;
    //    document.getElementById('monkey').style.backgroundPositionY=(100-num)+'%';
    //    zz=!zz;
    //    var img=zz?'monkey1.png':'monkey-1.png';
    //    document.getElementById('monkey').style.backgroundImage='url("img/'+img+'")';
    //},100);
    function deviceMotionHandler(eventData) {
        if(use){
            if(num>0 && cd){
                cd=false;
                //document.getElementById('monkey').classList.add('cur');
                var c=setInterval(function(){
                    if(time<=0){
                        use=false;
                        document.getElementById('mask').classList.add('show');
                        success(num);
                        clearInterval(c);
                    }else{
                        time--;
                        //document.getElementById('cd').innerHTML=time;
                    }
                },1000);
            }
            var acceleration =eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();

            if ((curTime - last_update)> 100) {
                var diffTime = parseInt(curTime -last_update);
                last_update = curTime;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                if (speed > SHAKE_THRESHOLD) {
                    num++;
                    document.getElementById('num').innerHTML=num;
                    if(num<100){
                        document.getElementById('monkey').style.backgroundPositionY=(100-num)+'%';
                        zz=!zz;
                        var img=zz?'monkey1.png':'monkey-1.png';
                        document.getElementById('monkey').style.backgroundImage='url("img/'+img+'")';
                    }

                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        }

    }

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion',deviceMotionHandler, false);
    }
    var success = function(rotation){
        app.ajax({
            url:'/send-statistics',
            data:{user:openid,rotation:rotation}
        });
    }
})();