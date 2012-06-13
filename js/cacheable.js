/*
This object serves as an interface for retrieving data from external source.
It takes care of caching the data, so you don't spam the source with your
requests.

It uses localStore to save the data by default. You can change it by providing
custom data callbacks in the options object:

- dataCallback
Function that checks the data from the source and returns them via
callback function. See below for AJAX example.

- onData
Event that fires every time any data is changed. This can happen either by
calling the dataCallback function or by calling Cacheable.set method.

- expire
Interval in seconds during which the data from dataCallback are considered
valid. 1 hour by default.

*/

function Cacheable(options) {

    var defaultDataCallback = function (callback) {
        callback(localStorage);
    }
    
    var defaultOnData = function (data) {
        for (key in data) {
            localStorage[key] = data[key];
        }
    }

    this.options = options || {};
    this.options.dataCallback = this.options.dataCallback || defaultDataCallback;
    this.options.onData = this.options.onData || defaultOnData;
    this.options.expire = this.options.expire || 60*60;  // 1 hour by default
    
    this.data = {};
    this.lastCheck = this.options.lastCheck || 0;
    
    this.set = function (data, callback) {
        var data = data || {};
        var callback = callback || function () {};
        
        var updateData = function () {
            for (key in data) {
                this.data[key] = data[key];
            }
            this.options.onData(this.data);
            callback(this.data);
        }
        
        this.get(null, updateData.bind(this))
    };
    
    this.get = function (key, callback) {
        var callback = callback || function () {};
        
        var handleData = function (data) {
            var result = key ? data[key] : key;
            callback(result);
        }
        
        var cacheData = function (data) {
            this.data = data;
            this.options.onData(this.data);
            this.lastCheck = (new Date).getTime();
            handleData(this.data);
        }
        
        if ((new Date).getTime() > this.lastCheck + this.options.expire) {
            this.options.dataCallback(cacheData.bind(this));
        } else {
            handleData(this.data);
        }
    };
    
    return this;
}

// Simple example using the defaults, working with localStorage

var simpleCache = new Cacheable();

simpleCache.set({'one' : 'two'}, function (data) {
    console.log('saving data:', data);
});

simpleCache.get('one', function (data) {
    console.log('received data:', data);
});

// Advanced example using AJAX to get data.

function ajax(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {callback(xhr.responseText);}
    };
    xhr.open("GET", url, true);
    xhr.send();
}

var advancedCache = new Cacheable({
    dataCallback :  function (callback) {
        ajax('http://www.datasource.com/data.json', function (response) {
            callback(JSON.parse(response));
        });
    },
    onData : function (data) {
        ajax('http://www.datasource.com/handledata?data=' + JSON.stringify(data)); 
    }
});