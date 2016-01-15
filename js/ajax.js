window.app = window.app || {};
app.ajax = function (obj) {
    obj = {
        method: obj.method || "POST",
        url: obj.url || "",
        data: obj.data || "",
        timeout: obj.timeout || 5000,
        success: obj.success || function () {},
        error: obj.error || function () {},
        complete: obj.complete || function () {},
        async: obj.async || true
    };
    var xhr = (function () {
        return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    })();
    var requestDone = false;
    //obj.url = obj.url + '?rand=' + Math.random();
    obj.data = (function (data) {
        var arr = [];
        for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);
    if (obj.data !== '' && obj.method === 'get') {
        obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
    }
    xhr.open(obj.method, obj.url, obj.async);
    setTimeout(function () {
        requestDone = true;
    }, obj.timeout);

    if (obj.async === true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && !requestDone) {
                callback();
            }
        };
    }
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }
    if (obj.async === false) {
        callback();
    }
    function callback() {
        if (xhr.status == 200) {
            obj.success(xhr.responseText);
        } else {
            obj.error(xhr.status, xhr.statusText);
        }
        obj.complete();
        xhr = null;
    }
    return this;
};