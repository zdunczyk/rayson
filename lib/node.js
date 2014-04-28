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
    function iterate(tree_data, keymap, concat_keys) {
        var stack = [ { level: 0, position: 0, key: NODE_ROOT_KEY, node: tree_data } ],
            current,
            result = [],
            new_instance,
            concat_key = null,
            not_parent = true,
            arr_as_value = false;
      
        while(stack.length !== 0) {
            current = stack.pop();  
            
            if(rayson.util.inArray(current.key, concat_keys))
                concat_key = current.key;
           
            if(rayson.util.isNode(current.node)) {
                result.push(current.node);

                if(current.key === concat_key)
                    concat_key = null;
            
            } else if(rayson.util.isArray(current.node)) {

                not_parent = true;
                for(var i = 0; i < current.node.length; 
                    not_parent = (not_parent && !rayson.util.isParent(current.node[i])),
                    i++
                );

                arr_as_value = not_parent && concat_key !== null;
               
                if(arr_as_value)
                    new_instance = newNode(NODE_TYPE_VAL, current);
                else 
                    new_instance = newNode(NODE_TYPE_ARRAY, current, { value: '' });
                
                stack.push({ 
                    node: new_instance                
                });
                   
                if(!arr_as_value) {
                    for(var i = 0; i < current.node.length; i++) {
                        stack.push({ 
                            node: current.node[i], 
                            level: current.level + 1,
                            position: i,
                            parent: new_instance
                        });
                    }
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

                function push_child(child) {
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

                var with_key = current;
                while(rayson.util.isUndefined(with_key.key)
                        && !rayson.util.isUndefined(with_key.parent)) {
                    with_key = with_key.parent;     
                }
                
                if(rayson.util.isObject(keymap) 
                    && rayson.util.isArray(keymap[with_key.key])) {
                
                    for(var k = 0; k < keymap[with_key.key].length; k++)
                        push_child(keymap[with_key.key][k]);

                } else {
                    for(var child in current.node)
                        push_child(child);
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