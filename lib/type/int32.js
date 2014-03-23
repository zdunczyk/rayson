// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};
rayson.type = rayson.type || {};

(function(bundle) {
    var INT_BYTE_SIZE = 4;
    
    bundle.int32 = rayson.util.setTypeFlag({
        encode: function(int32) {
            var result = [],
                i;    
            
            for(i = (INT_BYTE_SIZE - 1); i >= 0; i--)
                result.push((int32 >>> (i * 8)) & 0xFF);
           
            return result;
        },
        decode: function(bytearr) {
            if(bytearr.length !== INT_BYTE_SIZE)
                return 0;
            
            var result = 0x00;

            for(i = 0; i < INT_BYTE_SIZE; i++)
                result |= (bytearr[INT_BYTE_SIZE - i - 1] << (i * 8));

            return result;
        }
    });
    
})(rayson.type);