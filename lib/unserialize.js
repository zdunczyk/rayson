// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
        
    var defaults = {
        // true when input should match template 1:1
        strict: false
    };

    bundle.unserialize = function(data, template, params) {
        if(rayson.util.isArray(data)) {
            data = new rayson.stream(data);
        } else if(!rayson.util.isStream(data))
            throw new Error('Expected array of bytes or stream'); 
    
        if(rayson.util.isUndefined(params)) 
            params = {};
        
        for(var def in defaults) {
            params[def] = params[def] || defaults[def];
        }
   
        template = rayson.node.iterate(template);
            
            // stack for refrences to result tree,
            // last element is parent of current node
        var stack = [],
            
            // holds pointer to template of elements of
            // current array, and its level in the tree
            template_stack = [],
            
            // holds size of current level and position 
            // of cursor
            levels_stack = [],                        
            
            // info about current node from stream
            node_content = null,
            node_size = -1,
            node_is_array = false,
            
            // tracks level in stream's tree
            stream_level = 0,
            
            // holds reference to current template node
            template_cnt = 0,
            template_node,
            template_defined = false,

            // indicates which cursor is futher
            stream_further = true,
            template_further = true,
            
            // holds result tree
            result,
            
            // true whenever template and stream trees are on the same level
            level_conforms = false,
                   
            // array mode is on when there was specified array template in any of parent nodes 
            array_mode = false;
    
        while(!data.empty()) {
            array_mode = false;

            // when next object from templated array apply same template
            if(template_stack.length > 0) {
                var current_template = template_stack[template_stack.length - 1];
                
                array_mode = (current_template.type === rayson.node.TYPE_INTERNAL);
                
                /** @todo add protection from inifinitive loops */
                if(stream_level <= current_template.level 
                    || array_mode) {
                    template_cnt = current_template.template_ptr;
                }
            }
            
            template_node = template[template_cnt];
            template_defined = !rayson.util.isUndefined(template_node);
           
            level_conforms = template_defined && (stream_level === template_node.level);
            
            stream_further = 
                        !template_defined 
                        // is template cursor deeper (or at same level) in tree 
                        || (stream_level <= template_node.level) 
                        || (levels_stack > 0 
                                && template_node.position <= levels_stack[levels_stack.length - 1].position);
                
            template_further = 
                        !template_defined 
                        // is stream cursor deeper (or at same level) in tree 
                        || (stream_level >= template_node.level)
                        || (levels_stack > 0 
                                && template_node.position >= levels_stack[levels_stack.length - 1].position);
            
            // template cursor iterated further or is equal to stream's one
            if(template_further) { 
                node_is_array = (data.getByte() & 0x80) === 0x80;
                
                node_size = rayson.uleb128.decode(data);

                // strict mode check
                if((rayson.util.isParentNode(template_node) !== node_is_array) && params.strict) {
                    var strict_msg;
                    
                    if(node_is_array)
                        strict_msg = 'array structure from stream corresponds to `' + template_node.key + '` key in template';
                    else
                        strict_msg = 'template key `' + template_node.key + '` corresponds to array structure in stream';
                    
                    throw new Error('Strict: ' + strict_msg);
                }

                if(!node_is_array) {
                    node_content = data.readByte(node_size);
                    
                    if(level_conforms || array_mode) {
                        if(rayson.util.isType(template_node.value))
                            node_content = template_node.value.decode(node_content);
                        else
                            node_content = template_node.value;
                    }
                    
                } else if(level_conforms || array_mode) {
                    
                    if(rayson.util.isArrayNode(template_node) 
                        || rayson.util.isType(template_node.value))
                        node_content = [];
                    else
                        node_content = {};
                }

                // move position in top level
                if(levels_stack.length > 0)
                    levels_stack[levels_stack.length - 1].position++;
                
                if(stack.length > 0 && (level_conforms || array_mode)) {
                    if(rayson.util.isArray(stack[stack.length - 1]))
                        stack[stack.length - 1].push(node_content);
                    else
                        stack[stack.length - 1][template_node.key] = node_content;
                }
                  
                if(level_conforms) {
                    // save template position for next items in array
                    if(node_is_array && rayson.util.isArrayNode(template_node)) {
                        var template_next = template[template_cnt + 1];
                        
                        if(rayson.util.isObjectNode(template_next)
                            || rayson.util.isType(template_next.value)) {
                    
                            template_stack.push({   
                                level: template_next.level,
                                type: template_next.type, 
                                template_ptr: template_cnt + 1
                            });
                        }
                    }
                }
                
                if(node_is_array) {
                    stack.push(node_content);
                   
                    // saves current level params
                    levels_stack.push({ size: node_size, position: 0 });

                    stream_level++;
                }
               
                // pop all filled levels from top of the stack 
                while(levels_stack.length > 0 
                        && levels_stack[levels_stack.length - 1].position >= levels_stack[levels_stack.length - 1].size) {
                    result = stack.pop();
                    levels_stack.pop();
                    
                    stream_level--;
                    
                    // when poped level used template for its elements pop it from stack as well
                    if(template_stack.length > 0 
                            && stream_level < template_stack[template_stack.length - 1].level) {
                        template_stack.pop();
                    }
                }
            }
            
            // go through template tree until level and position of cursor match those from stream
            if(stream_further)
                template_cnt++;
        }
        
        return result;
    };

})(rayson);