import axios from '../../lib/axios'

(function () {
    // Just for you IE8
    if (typeof Array.prototype.indexOf === 'undefined') {
        Array.prototype.indexOf = function (item) {
            for (var i=0, l=this.length; i<l; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    }

    var url = document.getElementById('url');
    var method = document.getElementById('method');
    var params = document.getElementById('params');
    var data = document.getElementById('data');
    var headers = document.getElementById('headers');
    var submit = document.getElementById('submit');
    var request = document.getElementById('request');
    var response = document.getElementById('response');

    function acceptsData(method) {
        return ['PATCH', 'POST', 'PUT'].indexOf(method) > -1;
    }

    function getUrl() {
        return url.value.length === 0 ? '/api' : url.value;
    }

    function getParams() {
        return params.value.length === 0 ? null : JSON.parse(params.value);
    }

    function getData() {
        return data.value.length === 0 ? null : JSON.parse(data.value);
    }

    function getHeaders() {
        return headers.value.length === 0 ? null : JSON.parse(headers.value);
    }

    function syncWithLocalStorage() {
        method.value = localStorage.getItem('method') || 'GET';
        params.value = localStorage.getItem('params') || '';
        data.value = localStorage.getItem('data') || '';
        headers.value = localStorage.getItem('headers') || '';
    }

    function syncParamsAndData() {
        switch (method.value) {
            case 'PATCH':
            case 'POST':
            case 'PUT':
                params.parentNode.style.display = 'none';
                data.parentNode.style.display = '';
                break;
            default:
                params.parentNode.style.display = '';
                data.parentNode.style.display = 'none';
                break;
        }
    }

    submit.onclick = function () {
        var options = {
            url: getUrl(),
            params: !acceptsData(method.value) ? getParams() : undefined,
            data: acceptsData(method.value) ? getData() : undefined,
            method: method.value,
            headers: getHeaders()
        };

        request.innerHTML = JSON.stringify(options, null, 2);

        axios(options)
            .then(function (res) {
                response.innerHTML = JSON.stringify(res.data, null, 2);
            })
            .catch(function (res) {
                response.innerHTML = JSON.stringify(res.data, null, 2);
            });
    };

    url.onchange = function () {
        localStorage.setItem('url', url.value);
    };

    method.onchange = function () {
        localStorage.setItem('method', method.value);
        syncParamsAndData();
    };

    params.onchange = function () {
        localStorage.setItem('params', params.value);
    };

    data.onchange = function () {
        localStorage.setItem('data', data.value);
    };

    headers.onchange = function () {
        localStorage.setItem('headers', headers.value);
    };

    syncWithLocalStorage();
    syncParamsAndData();
})();
