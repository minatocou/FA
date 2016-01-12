var SHAKE_THRESHOLD=800;
var last_update = 0;
var num=0;
var time=15;
var x, y, z, last_x=0, last_y=0, last_z=0;
var use=true;
var cd=true;
function deviceMotionHandler(eventData) {
    if(use){
        if(num>0 && cd){
            cd=false;
            document.getElementById('monkey').classList.add('cur');
            var c=setInterval(function(){
                if(time<=0){
                    use=false;
                    document.getElementById('mask').classList.add('show');
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