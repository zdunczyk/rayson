// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
        
    var defaults = {
        // true when input should match template 1:1
        strict: false
    };

    bundle.unserialize = function(data, template, params) {
        if(rayson.util.isArray(data)) {
            data = new rayson.stream(data);
        } else if(!rayson.util.isStream(data))
            throw new Error('Expected array of bytes or stream'); 
        
        // some unserializing
    };

})(rayson);