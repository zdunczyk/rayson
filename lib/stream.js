// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
    
    var stream = function(data) {
        this.data = data;
        this.cursor = 0;
    };

    stream.prototype.empty = function() {
        return this.cursor >= this.data.length;
    };

    stream.prototype.readByte = function(n) {
        if(rayson.util.isNumeric(n)) 
            return this.data.slice(this.cursor, this.cursor += n);
            
        return this.data[this.cursor++];    
    }; 
   
    bundle.stream = stream;

})(rayson);

