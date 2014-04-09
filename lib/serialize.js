// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
    
    bundle.serialize = function(tree_data, types) {
        var nodes = rayson.node.iterate(tree_data),
            node_cnt = 0,
            result = [],
            current,
            encoded_length = [],
            encoded_value = [],
            isUndefined = rayson.util.isUndefined,
            key_type = null,
            checksum; 
       
        for(; node_cnt < nodes.length; node_cnt++) {
            encoded_value = [];
            current = nodes[node_cnt];
            
            if(rayson.util.isParentNode(current)) {
                encoded_length = rayson.uleb128.encode(current.length);
                encoded_length[0] |= 0x80;  
                
            } else {
                if(!isUndefined(current.value)) {
                    key_type = current;
                    
                    while(
                          (isUndefined(key_type.key) || isUndefined(types[key_type.key]))
                        && !isUndefined(key_type.parent) 
                        && key_type.value !== rayson.node.ROOT_KEY
                    ) {
                        key_type = key_type.parent;
                    }
                    
                    if(!isUndefined(key_type.key) && rayson.util.isType(types[key_type.key]))
                        encoded_value = types[key_type.key].encode(current.value); 
                    else
                        encoded_value = rayson.type.raw.encode(current.value);
                }
                
                encoded_length = rayson.uleb128.encode(encoded_value.length);
            }
            
            result.push.apply(result, encoded_length);
            result.push.apply(result, encoded_value);
        }

        checksum = rayson.crc16(result);
        
        result.push.apply(result, [(checksum >>> 8) & 0xFF, checksum & 0xFF]);
        
        return result;
    };
    
})(rayson);
