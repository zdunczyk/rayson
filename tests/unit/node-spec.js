// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe("Array of tree's nodes", function() {
    var sample_tree = rayson.node.iterate({
        obj1: {
            arr1: [ 'val1', 'val2', 'val3' ],
            obj2: {
                foo: 'val4',
                arr2: [
                    { foo11: 'val11', foo12: { a: 'aval12', b: 'bval12' }  },
                    { foo21: 'val21', foo22: 'val22' }
                ]
            }
        }    
    });

    it('should contain proper number of elements', function() {
        expect(sample_tree.length).toEqual(17);
    });

    it('should follow dfs strategy', function() {
        var key_val = sample_tree.map(function(node) {
            return [ node.key, node.value ];
        });
        
        expect(key_val).toEqual([
            [ rayson.node.ROOT_KEY, '' ],
            [ 'obj1', '' ],
            [ 'arr1', '' ],
            [ undefined, 'val1' ],
            [ undefined, 'val2' ],
            [ undefined, 'val3' ],
            [ 'obj2', '' ],
            [ 'foo', 'val4' ],
            [ 'arr2', '' ],
            [ undefined, '' ],
            [ 'foo11', 'val11' ],
            [ 'foo12', '' ],
            [ 'a', 'aval12' ],
            [ 'b', 'bval12' ],
            [ undefined, '' ],
            [ 'foo21', 'val21' ],
            [ 'foo22', 'val22' ] 
        ]);
    });
});


