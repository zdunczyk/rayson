// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
    
    bundle.stream = function(data) {
        this.data = data;
        this.cursor = 0;
    };

    bundle.stream.prototype.empty = function() {
        return this.cursor >= this.data.length;
    };

    bundle.stream.prototype.readByte = function() {
        return this.data[this.cursor++];    
    }; 
    
})(rayson);

