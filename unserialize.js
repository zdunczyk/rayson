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
            
            // stack for refrences to result tree
        var stack = [],
            // holds { level, template_ptr } tuples
            ptr_stack = [],
            // size of coresponding nodes from stack
            size_stack = [],                        
            // counter for template nodes
            global_cnt = 0,
            // content of current node when read from stream
            node_content = null,
            // size of node's content
            node_size = -1,
            // is current node an array
            node_is_array = false,
            // tracks level in stream's tree
            node_level = 0,
            // holds reference to current template node
            template_node,
            // is template at global_cnt defined
            template_defined = false,
            // is cursor of streams tree deeper or at the same level as cursor 
            // of template tree
            node_deeper = true,
            // is cursor of template tree deeper or at the same level as cursor 
            // of stream tree
            template_deeper = true,
            // holds result tree
            result,
            // true when template and stream conforms 
            template_conforms = false;

        while(!data.empty()) {
            // when next object from array apply same template
            if(ptr_stack.length > 0 
                    && node_level <= ptr_stack[ptr_stack.length - 1].level) { 
                global_cnt = ptr_stack[ptr_stack.length - 1].template_ptr;
            }
                
            template_node = template[global_cnt];
            template_defined = !rayson.util.isUndefined(template_node);
            node_deeper = !template_defined || node_level >= template_node.level;
            template_deeper = !template_defined || node_level <= template_node.level;
            template_conforms = template_defined && (node_level === template_node.level)
                                && template_node.position === ;
           
            if(typeof template_node !== 'undefined')
                console.dir([ template_node.level, node_level ]);
            //console.log(global_cnt);
            
            if(node_deeper) { 
                node_is_array = (data.getByte() & 0x80) === 0x80;
                
                node_size = rayson.uleb128.decode(data);

                if((rayson.util.isParentNode(template_node) !== node_is_array) && params.strict) {
                    var strict_msg;
                    
                    if(node_is_array)
                        strict_msg = 'array structure from stream corresponds to `' + template_node.key + '` key in template';
                    else
                        strict_msg = 'template key `' + template_node.key + '` corresponds to array structure in stream';
                    
                    throw new Error('Strict: ' + strict_msg);
                }

                if(!node_is_array) {
                    /** @todo allow other content than utf-16 encoded */
                    node_content = String.fromCharCode.apply(null, data.readByte(node_size));
                } else {
                    if(template_conforms && rayson.util.isArrayNode(template_node))
                        node_content = [];
                    else
                        node_content = {};
                }
           
                if(template_conforms) {
                    if(stack.length > 0) {
                        if(rayson.util.isArray(stack[stack.length - 1]))
                            stack[stack.length - 1].push(node_content);
                        else
                            stack[stack.length - 1][template_node.key] = node_content;
                    }
                    
                   
                    if(rayson.util.isArrayNode(template_node)
                        && rayson.util.isObjectNode(template[global_cnt + 1])) {
                        
                        ptr_stack.push({   
                            level: template[global_cnt + 1].level,
                            template_ptr: global_cnt + 1
                        });
                    }
                }
                
                if(node_is_array) {
                    stack.push(node_content);
                    
                    size_stack.push(node_size); 
                    node_level++;
                }
               
                if(rayson.util.size(stack[stack.length - 1]) >= size_stack[size_stack.length - 1]) {
                    console.log('asd');
                    result = stack.pop();
                    size_stack.pop();
                    
                    node_level--;
                    
                    if(ptr_stack.length > 0 
                            && node_level < ptr_stack[ptr_stack.length - 1].level)
                        ptr_stack.pop();

                }
            }
            
            if(template_deeper)
                global_cnt++;
        }
       
        return result;
    };

})(rayson);