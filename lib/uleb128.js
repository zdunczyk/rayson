// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    // right bit shift >>
    function rsh(val, bits) {
        return Math.floor(val/Math.pow(2, bits));            
    }

    // left bit shift <<   
    function lsh(val, bits) {
        return val*Math.pow(2, bits);
    }

    function ulebSize(bitsize) {
        return Math.ceil((bitsize - 6) / 7) + 1;
    }
    
    function bitSize(number) {
        return Math.ceil(Math.log(number + 1)/Math.log(2));
    }

    function encode(val) {
        var output = []; 
        var output_size = ulebSize(bitSize(val));
        
        for(var i = 0; i < output_size; i++) {
            var part = val & 0x7F;
            val = rsh(val, 7);
           
            if(i !== 0) {
                if(i === output_size - 1)
                    part |= 0x40; 
                else
                    part |= 0x80;
            }
            
            output.push(part);
        }

        return output.reverse();
    }

    bundle.uleb128 = {
        encode: encode
    };
    
})(rayson);

