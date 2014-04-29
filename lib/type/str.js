// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};
rayson.type = rayson.type || {};

(function(bundle) {
    
    bundle.str = rayson.util.setTypeFlag({
        encode: function(str) {
            return unescape(encodeURIComponent(str)).split('').map(function(ch) {
                return ch.charCodeAt(0);
            });
        },
        decode: function(bytearr) {
            return decodeURIComponent(escape(String.fromCharCode.apply(null, bytearr)));
        }
    });
    
})(rayson.type);    
        


