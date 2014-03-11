// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    var ULEB_MAX_SIZE = ulebSize(bitSize(Number.MAX_VALUE));

    // right bit shift >>
    function rsh(val, bits) {
        return Math.floor(val / Math.pow(2, bits));            
    }

    // left bit shift <<   
    function lsh(val, bits) {
        return val * Math.pow(2, bits);
    }

    // same as |, assumes that matching bits are 0's in result
    function bitor(a, b) {
        return a + b;       
    }

    function ulebSize(bitsize) {
        return Math.ceil((bitsize - 6) / 7) + 1;
    }
    
    function bitSize(number) {
        return Math.ceil(Math.log(number + 1)/Math.log(2));
    }

    function encode(val) {
        var output = [],
            output_size = ulebSize(bitSize(val)),
            part;
        
        for(var i = 0; i < output_size; i++) {
            part = val & 0x7F;
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

    function decode(stream) {
        var cnter = 0,
            byte,
            queue = [],
            result = 0;

        if(rayson.util.isStream(stream)) {
            byte = stream.readByte();
            queue.push(byte & 0x3F);
            
            if((byte & 0x40) === 0x40) {
                
                do {
                    cnter++; 
                    byte = stream.readByte();
                    queue.push(byte & 0x7F);
                } while((byte & 0x80) === 0x80 && cnter < ULEB_MAX_SIZE);
            }

            result = queue.shift();
            
            while(queue.length > 0) {
                result = lsh(result, 7);
                result = bitor(result, queue.shift());
            }
        }
        
        return result;
    }

    bundle.uleb128 = {
        encode: encode,
        decode: decode
    };
    
})(rayson);

