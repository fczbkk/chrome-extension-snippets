// TODO I'll add some documentation later. First I have to empty my head
// and then figure out again, what this object does. But it works!

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
    this.options.expire = this.options.expire || 60*60*24;
    
    this.data = {};
    this.lastCheck = 0;
    
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

// OK, let's test it!

var myCache = new Cacheable();

myCache.set({'one' : 'two'}, function (data) {
    console.log('saving data:', data);
});

myCache.get('one', function (data) {
    console.log('received data:', data);
});