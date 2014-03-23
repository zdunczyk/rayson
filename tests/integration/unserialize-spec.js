// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe("Unserialization", function() {
    
    var str = rayson.type.str,
        int32 = rayson.type.int32,
        bool = rayson.type.bool;

    it('should work with simple one-level json', function() {
        var data = {
            foo1: 'bar1',
            bar1: 1234,
            foo2: 'bar2',
            bar2: false
        };

        var template = {
            foo1: str,
            bar1: int32,
            foo2: str,
            bar2: bool
        };
         
        var serialized = rayson.serialize(data, template);
        var unserialized = rayson.unserialize(serialized, template);

        expect(unserialized).jsonEqual(data); 
    });

    it('should support array templates', function() {
        var data = {
            start: 5454,
            arr: [
                { foo: true, bar: 'foo2' },
                { foo: false, bar: 'foo1' }, 
                { foo: false, bar: 'foo3' } 
            ],
            end: 4545
        }; 

        var template = {
            start: int32,
            arr: [
                { foo: bool, bar: str }    
            ],
            end: int32
        };

        var serialized = rayson.serialize(data, {
            start: template.start,
            end: template.end,
            foo: bool,
            bar: str
        });
        
        var unserialized = rayson.unserialize(serialized, template);
        
        expect(unserialized).jsonEqual(data); 
    });
});