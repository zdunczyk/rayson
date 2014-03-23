// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};
rayson.type = rayson.type || {};

(function(bundle) {
    // signed from -128 to 127
    bundle.int8 = rayson.util.setTypeFlag({
        encode: function(int8) {
            return [ ((int8 % 129 + 128) % 256) ];
        },
        decode: function(bytearr) {
            return bytearr[0] - 128;
        }
    });
    
})(rayson.type);

