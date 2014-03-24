// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe("Unserialization", function() {
    
    var str = rayson.type.str,
        int32 = rayson.type.int32,
        bool = rayson.type.bool,
        int8 = rayson.type.int8;

    var obj1_arr1_data =  {
        start: true,
        fields: {
            a: 'foo',
            b: 'boo'
        },
        arr: [
            { z: 113, x: 'qwe' },
            { z: 113, x: 'ewq' }
        ],
        end: false
    };

    function obj1_arr1_provider() {
        return rayson.serialize(obj1_arr1_data, {
            root: str,
            start: bool,
            end: bool,
            z: int8
        });
    }
    
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

    it('works when template has some additional fields', function() {

        var template = {
            start: bool,
            fields: {
                a: str, b: str, c: int32
            },
            arr: [ 
                { z: int8, x: str, y: bool }
            ],
            end: bool,
            additional: str
        };
        
        var serialized = obj1_arr1_provider(),
            unserialized = rayson.unserialize(serialized, template);
        
        expect(unserialized).jsonEqual(obj1_arr1_data); 
    });

    it('works when there are some additional fields in data stream', function() {
        
        var template = {
            start: bool,
            fields: {
                a: str 
            },
            arr: [ 
                { z: int8 }
            ]
        };

        var result = {
            start: obj1_arr1_data.start,
            fields: {
                a: obj1_arr1_data.fields.a
            },
            arr: [
                { z: obj1_arr1_data.arr[0].z }, 
                { z: obj1_arr1_data.arr[1].z }
            ]
        };
        
        var serialized = obj1_arr1_provider(),       
            unserialized = rayson.unserialize(serialized, template);
        
        expect(unserialized).jsonEqual(result); 
    });

    it('should support simple non-object arrays', function() {
        var data = {
            start: 'start',
            arr: [ 2, 6, 3, 8, 9 ],
            end: true
        };

        var template = {
            start: str,
            arr: [ int32 ],
            end: bool
        };
        
        var serialized = rayson.serialize(data, {
            start: str,
            arr: int32,
            end: bool
        }),       
            unserialized = rayson.unserialize(serialized, template);
       
        expect(unserialized).jsonEqual(data); 
    });
});