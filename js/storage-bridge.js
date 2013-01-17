/*
Bridge object that takes care of seting and geting of config data to local
storage. If the data is in JSON format, it takes care of parsing and
stringifying.
*/

function StorageBridge(key, defaultValue, isJson) {
    this.key = key;
    this.isJson = isJson;
    this.defaultValue = defaultValue;
    if (isJson) {
        this.defaultValue = JSON.stringify(this.defaultValue);
    }
    
    this.get = function (callback) {
        callback = callback || function () {};
        var data = localStorage[this.key] || this.defaultValue;
        if (this.isJson) {
            data = JSON.parse(data);
        }
        callback(data);
    };
    
    this.set = function (data, callback) {
        console.log('data', data);
        callback = callback || function () {};
        data = data || this.defaultValue;
        if (this.isJson) {
            data = JSON.stringify(data);
        }
        localStorage[this.key] = data;
        callback();
    };
}

/* How to use - simple scenario */

var Name = new StorageBridge('name', 'John Doe');

Name.get(function (data) {
    // getting without first setting,
    // data contains default value 'John Doe'
});

Name.set('Johnny Mnemonic', function () {
    // data is set
});

Name.get(function (data) {
    // now data contains 'Johnny Mnemonic'
});


/* How to use - complex scenario */

var User = new StorageBridge('user', {
    name : 'John Doe',
    sex : 'M',
    birthday : 'April 18th 1978'
}, true);

User.get(function (data) {
    // data contains default values
    
    data.name = 'Johnny Mnemonic';
    data.birthday = 'May 1981';
    
    User.set(data, function () {
        // new data are stringified and saved in the local storage
    });
    
});


