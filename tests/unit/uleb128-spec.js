// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe('ULEB128 encoder', function() {

    using('input, result', [
        [ [ '00000001' ], 1 ],
        [ [ '00001001' ], 9 ],
        [ [ '10001001' ], 9 ],
        [ [ '11010101', '01000010' ], 2754 ],
        [ [ '11000000', '11000010', '01101011' ], 8555 ]

    ], function(input, result) {
        it('should properly decode byte arrays', function() {
            input = input.map(function(e) {
                return parseInt(e, 2);
            });
            
            expect(rayson.uleb128.decode(input)).toEqual(result);
        });
    });

    using('chunks', [
        [ [ '011111', '1101001', '1001110' ] ],
        [ [ '000101', '0100011', '1111010' ] ]
        
    ], function(chunks) {
        it('should properly divide number in chunks on encode', function() {
            // set control bits 
            var result = '';
            for(var i = 0; i < chunks.length; i++) {     
                if(i === (chunks.length - 1)) result += '0';
                else                          result += '1';    
                result += chunks[i];
            }
            
            var encoded = rayson.uleb128.encode(parseInt(chunks.join(''), 2));
            
            // toString(2) on all elements
            encoded = encoded.map(function(n) {  
                return (function pad(str, width, padding) { 
	                return (str.length >= width ? str : pad(padding + str, width, padding));
                    
                })(n.toString(2), 8, '0');
            });
            
            // substr (first 
            expect(encoded.join('').substr(1)).toEqual(result);
        });
    });

    using('number, byte index, byte position', [
        [ 0, 0, 0x40 ],    
        [ 64, 1, 0x80 ],
        [ 128, 1, 0x80 ],
        [ 2000, 1, 0x80 ],
        [ 8192, 2, 0x80 ]
        
    ], function(number, byte_idx, byte_pos) {
        it('should set first bit of last byte to 0', function() {
            var numbyte = rayson.uleb128.encode(number)[byte_idx];
            
            expect(numbyte).toBeDefined();
            expect((numbyte & byte_pos) === byte_pos).toBe(false);           
        });
    });

    using('number, length', [
        [ 64, 2 ],
        [ 128, 2 ],
        [ 8191, 2 ]
        
    ], function(number, length) {
        it('should encode numbers up to 8191 in two bytes', function() {
            expect(rayson.uleb128.encode(number).length).toEqual(length); 
        });
    });

    using('number, length', [
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

