// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    var NODE_TYPE_OBJ = 'obj';
    var NODE_TYPE_ARRAY = 'array';
    var NODE_TYPE_VAL = 'val';
    var NODE_TYPE_INTERNAL = 'internal';

    function newNode(type, length, value) {
        return rayson.util.setNodeFlag(new Node(type, length, value));
    }

    function Node(type, length, value) {
        this.type = type;
        this.length = length;
        this.value = value;
    }

    // dfs json traversal
    function iterate(tree_data) {
        var stack = [ tree_data ],
            current,
            result = [];
      
        while(stack.length !== 0) {
            current = stack.pop();   
           
            if(rayson.util.isNode(current)) {
                result.push(current);
            } else if(rayson.util.isArray(current)) {
                stack.push(newNode(NODE_TYPE_ARRAY, current.length, ''));
                for(var i = 0; i < current.length; i++) {
                    stack.push(current[i]);
                }
            } else if(rayson.util.isType(current)) {
                stack.push(newNode(NODE_TYPE_INTERNAL, 0, current));  
            } else if(rayson.util.isObject(current)) {
                var current_node = newNode(NODE_TYPE_OBJ, 0, '');
                stack.push(current_node);
                for(var child in current) {
                    if(current.hasOwnProperty(child)) {
                        stack.push(current[child]);    
                        current_node.length++;
                    }
                }
            } else {
                if(!rayson.util.isUndefined(current))
                    result.push(newNode(NODE_TYPE_VAL, current.length, current));
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