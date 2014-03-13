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
        
        var stack = [],
            global_cnt = 0,
            level_cnt = 0,
            level_size = -1,
            node_content = null,
            node_size = -1,
            node_is_array = false,
            result;

        while(!data.empty()) {
            
            node_is_array = (data.getByte() & 0x80) === 0x80;

            node_size = rayson.uleb128.decode(data);

            if((rayson.util.isParentNode(template[global_cnt]) !== node_is_array) && params.strict);

            if(!node_is_array) {
                /** @todo allow other content than utf-16 encoded */
                node_content = String.fromCharCode.apply(null, data.readByte(node_size));
                level_cnt++;
            } else {
                node_content = {};
                level_cnt = 0;
                level_size = node_size;
            }
           
            if(stack.length > 0)
                stack[stack.length-1][template[global_cnt].key] = node_content;
    
            if(node_is_array)
                stack.push(node_content);
            
            if(level_cnt >= level_size)
                result = stack.pop();
            
            global_cnt++;
        }
        
        return result;
    };

})(rayson);