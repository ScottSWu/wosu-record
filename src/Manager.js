var Manager = function() {
    this.rootLocation = "";
    this.locations = [
        "\\Program Files (x86)\\osu!",
        "\\Program Files\\osu!",
        process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"] + "\\AppData\\Local\\osu!"
    ];
    
    this.mapToHash = new Map();
    this.hashToMap = new Map();
    this.skins = new Array();
};

Manager.prototype.constructor = Manager;

Manager.prototype.loadRoot = function() {
    var location;
    for (var i = 0; i < this.locations.length; i++) {
        try {
            var stat = fs.statSync(this.locations[i]);
            if (stat.isDirectory()) {
                location = this.locations[i];
                break;
            }
        }
        catch (e) {
            
        }
    }
    
    if (location !== undefined) {
        this.rootLocation = location;
        return true;
    }
    else {
        return false;
    }
};

Manager.prototype.loadSongs = function(finish) {
    var instance = this;
    
    if (this.rootLocation === undefined) {
        return false;
    }
    
    fs.stat("songCache", function(err, cache) {
        if (!err && cache.isFile()) { // Load from cache
            var cacheData = fs.readFileSync("songCache", "utf8");
            cacheData.split(",").forEach(function(line) {
                var parts = line.trim().split("::");
                instance.mapToHash.set(parts[0], parts[1]);
                instance.hashToMap.set(parts[1], parts[0]);
            });
        }
        else { // Read from osu! installation
            var songLocation = instance.rootLocation + "\\Songs";
            var stack = [ songLocation ];
            var count = 0;
            while (stack.length > 0) {
                var loc = stack.pop();
                var list = fs.readdirSync(loc);
                list.forEach(function(f) {
                    var stat = fs.statSync(loc + "\\" + f);
                    if (stat.isFile() && f.endsWith(".osu")) {
                        instance.addMap(loc + "\\" + f);
                        count++;
                        if (count % 1000 == 0) console.log(count);
                    }
                    else if (stat.isDirectory()) {
                        stack.push(loc + "\\" + f);
                    }
                });
            }
            
            // Write to cache file
            var cacheData = "";
            instance.mapToHash.forEach(function(value, key) {
                cacheData += key + "::" + value + ",\n"
            });
            fs.writeFile("songCache", cacheData);
        }
        finish();
    });
};

Manager.prototype.addMap = function(f) {
    f = path.resolve(f);
    if (!this.mapToHash.has(f)) {
        var hash = cryptography.createHash("md5");
        
        var data = fs.readFileSync(f);
        hash.update(data);
        
        var sum = hash.digest("hex").toLowerCase();
        this.mapToHash.set(f, sum);
        this.hashToMap.set(sum, f);
    }
};

Manager.prototype.loadSkins = function(finish) {
    var instance = this;
    
    if (this.rootLocation === undefined) {
        return false;
    }
    
    var skinLocation = this.rootLocation + "\\Skins";
    fs.readdir(skinLocation, function(err, folders) {
        if (err) return;
        var queue = folders.length;
        folders.forEach(function(f) {
            fs.stat(skinLocation + "\\" + f, function(err, stat) {
                queue--;
                if (!err && stat.isDirectory()) {
                    instance.addSkin(skinLocation + "\\" + f);
                }
                if (queue == 0) {
                    finish();
                }
            });
        });
    });
};

Manager.prototype.addSkin = function(f) {
    f = path.resolve(f);
    this.skins.push(f);
};