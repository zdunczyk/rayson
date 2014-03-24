// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    var NODE_TYPE_OBJ = 'obj';
    var NODE_TYPE_ARRAY = 'array';
    var NODE_TYPE_VAL = 'val';
    var NODE_TYPE_INTERNAL = 'internal';
    var NODE_ROOT_KEY = 'root';

    function newNode(type, stack_obj, init) {
        var result = rayson.util.setNodeFlag(new Node(
                type, 
                stack_obj.node.length, 
                stack_obj.node, 
                stack_obj.level, 
                stack_obj.position, 
                stack_obj.parent,
                stack_obj.key
        ));

        for(var def in init) 
            result[def] = init[def];
        
        return result;
    }

    function Node(type, length, value, lvl, pos, parent, key) {
        this.type = type;
        this.length = length;
        this.value = value;
        this.level = lvl;
        this.position = pos;
        this.parent = parent;
        
        if(!rayson.util.isUndefined(key))
            this.key = key;
    }

    // dfs json traversal
    function iterate(tree_data) {
        var stack = [ { level: 0, position: 0, key: NODE_ROOT_KEY, node: tree_data } ],
            current,
            result = [],
            new_instance;
      
        while(stack.length !== 0) {
            current = stack.pop();   
           
            if(rayson.util.isNode(current.node)) {
                result.push(current.node);
            
            } else if(rayson.util.isArray(current.node)) {
                new_instance = newNode(NODE_TYPE_ARRAY, current, { value: '' }); 

                stack.push({ 
                    node: new_instance                
                });
                
                for(var i = 0; i < current.node.length; i++) {
                    stack.push({ 
                        node: current.node[i], 
                        level: current.level + 1,
                        position: i,
                        parent: new_instance
                    });
                }
                
            } else if(rayson.util.isType(current.node)) {
                stack.push({
                    node: newNode(NODE_TYPE_INTERNAL, current, { length: 0 }) 
                });  
                
            } else if(rayson.util.isObject(current.node)) {
                new_instance = newNode(NODE_TYPE_OBJ, current, { value: '', length: 0 });
                
                stack.push({
                    node: new_instance
                });
                
                for(var child in current.node) {
                    if(current.node.hasOwnProperty(child)) {
                        stack.push({
                            key: child,
                            node: current.node[child],
                            level: current.level + 1,
                            position: new_instance.length,
                            parent: new_instance
                        });    
                        new_instance.length++;
                    }
                }
            } else {
                if(!rayson.util.isUndefined(current.node))
                    result.push(newNode(NODE_TYPE_VAL, current));
            }
        }
        
        return result.reverse();
    };

    bundle.node = {
        iterate: iterate,
        TYPE_OBJ: NODE_TYPE_OBJ,
        TYPE_ARRAY: NODE_TYPE_ARRAY,
        TYPE_VAL: NODE_TYPE_VAL,
        TYPE_INTERNAL: NODE_TYPE_INTERNAL,
        ROOT_KEY: NODE_ROOT_KEY
    };
    
})(rayson);