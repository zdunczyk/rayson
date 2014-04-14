// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};
rayson.type = rayson.type || {};

(function(bundle) {
    
    bundle.raw = rayson.util.setTypeFlag({
        encode: function(bytearr) {
            if(!rayson.util.isArray(bytearr))
                return [];
            
            return bytearr;
        },
        decode: function(bytearr) {
            return bytearr;
        },
        raw: true
    });
    
})(rayson.type);
