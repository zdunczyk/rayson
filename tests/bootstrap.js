// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var vm = require('vm'),
    dirs = require('./require.json'),
    i = 0;

function include_dir(dir) {
    var fs, 
        libs = '';

    (fs = require("fs")).readdirSync(dir).forEach(function(file) {
        if(!fs.lstatSync(dir + file).isDirectory())
            libs += fs.readFileSync(dir + file);
    });
    
    global.eval(libs);
}

for(i in dirs) 
    include_dir(__dirname + '/../' + dirs[i]);

