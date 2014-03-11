// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    var NODE_TYPE_OBJ = 'obj';
    var NODE_TYPE_ARRAY = 'array';
    var NODE_TYPE_VAL = 'val';
    var NODE_TYPE_INTERNAL = 'internal';

    function newNode(type, length, value, key) {
        return rayson.util.setNodeFlag(new Node(type, length, value, key));
    }

    function Node(type, length, value, key) {
        this.type = type;
        this.length = length;
        this.value = value;
        
        if(!rayson.util.isUndefined(key))
            this.key = key;
    }

    // dfs json traversal
    function iterate(tree_data) {
        var stack = [ { node: tree_data } ],
            current,
            result = [];
      
        while(stack.length !== 0) {
            current = stack.pop();   
           
            if(rayson.util.isNode(current.node)) {
                result.push(current.node);
            
            } else if(rayson.util.isArray(current.node)) {
                stack.push({ 
                    node: newNode(NODE_TYPE_ARRAY, current.node.length, '', current.key) 
                });
                
                for(var i = 0; i < current.node.length; i++) {
                    stack.push({ node: current.node[i] });
                }
                
            } else if(rayson.util.isType(current.node)) {
                stack.push({
                    node: newNode(NODE_TYPE_INTERNAL, 0, current.node, current.key)
                });  
                
            } else if(rayson.util.isObject(current.node)) {
                var current_instance = newNode(NODE_TYPE_OBJ, 0, '', current.key);
                
                stack.push({
                    node: current_instance
                });
                
                for(var child in current.node) {
                    if(current.node.hasOwnProperty(child)) {
                        stack.push({
                            key: child,
                            node: current.node[child]
                        });    
                        current_instance.length++;
                    }
                }
            } else {
                if(!rayson.util.isUndefined(current.node))
                    result.push(
                        newNode(
                            NODE_TYPE_VAL, 
                            current.node.length, 
                            current.node, 
                            current.key
                        )
                    );
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