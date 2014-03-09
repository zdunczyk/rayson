// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    var NODE_TYPE_OBJ = 'obj';
    var NODE_TYPE_ARRAY = 'array';
    var NODE_TYPE_VAL = 'val';

    var NODE_UNIQUE_KEY = (new Date()).getTime();

    function hasType(obj, type) {
        return {}.toString.call(obj) === '[object ' + type + ']';
    }

    function isNode(obj) {
        return typeof obj.identifier !== 'undefined' && obj.identifier === NODE_UNIQUE_KEY;
    }

    function Node(type, length, value) {
        this.type = type;
        this.length = length;
        this.value = value;
        this.identifier = NODE_UNIQUE_KEY;
    }

    // dfs json traversal
    function iterate(tree_data) {
        var stack = [ tree_data ],
            current,
            result = [];
      
        while(stack.length !== 0) {
            current = stack.pop();   
           
            if(isNode(current)) {
                result.push(current);
            } else if(hasType(current, 'Array')) {
                stack.push(new Node(NODE_TYPE_ARRAY, current.length, ''));
                for(var i = 0; i < current.length; i++) {
                    stack.push(current[i]);
                }
            } else if(hasType(current, 'Object')) {
                var current_node = new Node(NODE_TYPE_OBJ, 0, '');
                stack.push(current_node);
                for(var child in current) {
                    if(current.hasOwnProperty(child)) {
                        stack.push(current[child]);    
                        current_node.length++;
                    }
                }
            } else {
                result.push(new Node(NODE_TYPE_VAL, current.length, current));
            }
        }
        
        return result.reverse();
    };

    bundle.node = {
        iterate: iterate,
        TYPE_OBJ: NODE_TYPE_OBJ,
        TYPE_ARRAY: NODE_TYPE_ARRAY,
        TYPE_VAL: NODE_TYPE_VAL
    };
    
})(rayson);