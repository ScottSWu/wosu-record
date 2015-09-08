var async = function(f) {
    setTimeout(f, 5);
};

var resync = function(instance, arr, callback) {
    var count = 0;
    var total = arr.length;
    
    var finish = function() {
        count++;
        if (count >= total) {
            callback();
        }
    };
    
    arr.forEach(function(f) {
        f.call(instance, finish);
    });
};