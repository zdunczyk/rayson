// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    function encode(bytearr, encoder) {
        var chars = String.fromCharCode.apply(null, bytearr);
        
        if(!rayson.util.isUndefined(window.btoa))
            return window.btoa(chars);

        if(rayson.util.isFunction(encoder))
            return encoder(chars);
    
        throw new Error('There is no built-in encoder for b64, please provide one');
    }

    function decode(str, decoder) {
        var atobed;
        
        if(!rayson.util.isUndefined(window.atob))
            atobed = window.atob(str);
        else if(rayson.util.isFunction(decoder))
            atobed = decoder(str);
        else
            throw new Error('There is no built-in decoder for b64, please provide one');
        
        return atobed.split('').map(function(char) {
            return char.charCodeAt(0);        
        });
    }
    
    bundle.b64 = {
        encode: encode,
        decode: decode
    };
    
})(rayson);




