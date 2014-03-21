// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe("ULEB128 encoder", function() {

    using("number, length", [
        [ 64, 2 ],
        [ 128, 2 ],
        [ 8191, 2 ]
    ], function(number, length) {
        it('should encode numbers up to 8191 in two bytes', function() {
            expect(rayson.uleb128.encode(number).length).toEqual(length); 
        });
    });

    using("number, length", [
        [ 0, 1 ],
        [ 4, 1 ],
        [ 63, 1 ]
    ], function(number, length) {
        it('should encode numbers up to 63 in one byte', function() {
            expect(rayson.uleb128.encode(number).length).toEqual(length); 
        });
    });
    
    it('should shift bits without 32 length limit', function() {
        var more_than_32 = '1 00000000 00000000 00000000 00000000';
        
        var value = parseInt(more_than_32.replace(/ /g, ''), 2);
        
        expect(rayson.uleb128.lsh(value, 1)).toEqual(value * 2);
        expect(rayson.uleb128.rsh(value, 1)).toEqual(Math.floor(value / 2));
    });

});

