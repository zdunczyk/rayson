// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};
rayson.type = rayson.type || {};

(function(bundle) {
    
    bundle.bool = rayson.util.setTypeFlag({
        encode: function(boo) {
            if(boo === true)
                return [ 0xFF ];
            return [ 0x00 ];
        },
        decode: function(bytearr) {
            return bytearr[0] === 0xFF;
        }
    });
    
})(rayson.type);
