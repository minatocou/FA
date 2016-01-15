"use strict";

function Game(setting) {
    return Game.prototype.init(setting);
}
Game.prototype = {
    canvas: null,
    ctx: null,
    x1: null,
    y1: null,
    a: null,
    timeout: null,
    distance: null,
    imgArry: null,
    imgArryName:null,
    esImgClass:null,
    defaultImg:null,
    imgPath: "img/",
    esClear: 0.3,
    init: function (setting) {
        var $this = this;
        app.ajax({
            url: 'data/config.json', success: function (data) {
                data = JSON.parse(data);
                setting = setting || {};
                $this.canvas = document.getElementById("cas");
                $this.ctx = $this.canvas.getContext("2d");
                $this.x1 = $this.y1 = $this.a = setting.esMs || data.esMs;
                $this.timeout = $this.distance = 30;
                $this.canvas.width = setting.width || document.body.offsetWidth;
                $this.canvas.height = setting.height || document.body.offsetHeight;
                $this.imgArry = data[setting.imgArryName||"esImgs"];
                $this.esClear = setting.esClear || data.esClear;
                var dImg = new Image();
                var img = new Image();
                dImg.src = $this.imgPath + $this.imgArry.pop();
                dImg.classList.add(setting.esImgClass || "es-img");
                img.src = $this.imgPath + (setting.defaultImg || "es-0.jpg");
                img.onload = function () {
                    img.height = img.height * ($this.canvas.width / img.width);
                    img.width = $this.canvas.width;
                    var w = $this.canvas.height * img.width / img.height;
                    $this.ctx.drawImage(img, ($this.canvas.width - w) / 2, 0, w, $this.canvas.height);
                    document.getElementById(setting.es || "es").appendChild(dImg);
                    $this.tapClip();

                };
            }
        })
    },
    tapClip: function () {
        var $this = this;
        var ctx = $this.ctx;
        var canvas = $this.canvas;
        var x1 = $this.x1;
        var y1 = $this.y1;
        var a = $this.a;
        var timeout = $this.timeout;
        var hastouch = "ontouchstart" in window ? true : false,
            tapstart = hastouch ? "touchstart" : "mousedown",
            tapmove = hastouch ? "touchmove" : "mousemove",
            tapend = hastouch ? "touchend" : "mouseup";

        var area;
        var x2, y2;
        var down=false;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = a * 2;
        ctx.globalCompositeOperation = "destination-out";
        canvas.removeEventListener(tapstart, tStart);
        canvas.removeEventListener(tapmove, tapmoveHandler);
        canvas.removeEventListener(tapend, tapmoveHandler);
        canvas.addEventListener(tapstart, tStart);
        function tStart(e) {
            clearTimeout(timeout);
            e.preventDefault();
            down=true;
            area = $this.getClipArea(e, hastouch);

            x1 = area.x;
            y1 = area.y;
            $this.drawLine(x1, y1);
            canvas.addEventListener(tapmove, tapmoveHandler);
            canvas.addEventListener(tapend, tapmoveHandler);
        }

        function tapmoveHandler(e) {
            if(e.type==tapend){
                down=false;
            }
            if(down){
                clearTimeout(timeout);
                e.preventDefault();

                area = $this.getClipArea(e, hastouch);

                x2 = area.x;
                y2 = area.y;
                $this.drawLine(x1, y1, x2, y2);
                var num = 0;
                var datas = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < datas.data.length; i++) {
                    if (datas.data[i] == 0) {
                        num++;
                    }
                }

                if (num >= datas.data.length * $this.esClear) {
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    if ($this.imgArry.length > 0) {
                        setTimeout(function () {
                            startGame();
                        }, 3000);
                    }
                }

                x1 = x2;
                y1 = y2;
            }

        }
    },
    getClipArea: function (e, hastouch) {
        var x;
        var y;
        if (hastouch) {
            if (e.targetTouches[0]) {
                x = e.targetTouches[0].pageX;
                y = e.targetTouches[0].pageY;
            } else {
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY;
            }
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        var ndom = this.canvas;

        while (ndom.tagName !== "BODY") {
            x -= ndom.offsetLeft;
            y -= ndom.offsetTop;
            ndom = ndom.parentNode;
        }
        return {
            x: x,
            y: y
        }
    },
    drawLine: function (x1, y1, x2, y2) {
        var ctx = this.ctx;
        ctx.save();
        if (arguments.length == 2) {
            ctx.beginPath();
//                ctx.arc(x1, y1, a, 0, 2 * Math.PI);
//                ctx.fill();
        } else {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }
}
