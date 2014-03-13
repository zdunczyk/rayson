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
            // counter for template nodes
            global_cnt = 0,
            // counter of nodes at current level, when read from stream
            level_cnt = 0,
            // size of nodes at current level when read from stream
            level_size = -1,
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
            result;

        while(!data.empty()) {
            template_node = template[global_cnt];
            template_defined = !rayson.util.isUndefined(template_node);
            node_deeper = !template_defined || node_level >= template_node.level;
            template_deeper = !template_defined || node_level <= template_node.level;
            
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
                    level_cnt++;
                } else {
                    node_content = {};
                    level_cnt = 0;
                    level_size = node_size;
                }
            
                if(template_defined && (node_level === template_node.level) && stack.length > 0) 
                        stack[stack.length-1][template_node.key] = node_content;
                
                if(node_is_array) {
                    stack.push(node_content);
                    node_level++;
                }
                
                if(level_cnt >= level_size) {
                    result = stack.pop();
                    node_level--;
                }
            }
            
            if(template_deeper)
                global_cnt++;
        }
        
        return result;
    };

})(rayson);