// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {
    
    bundle.serialize = function(tree_data) {
        var nodes = rayson.node.iterate(tree_data),
            node_cnt = 0,
            value_cnt = 0,
            result = [],
            current;
        
        for(; node_cnt < nodes.length; node_cnt++) {
            current = nodes[node_cnt];
            var encoded = rayson.uleb128.encode(current.length); 
            
            if(rayson.util.isParentNode(current))
                encoded[0] |= 0x80;  
          
            result.push.apply(result, encoded);

            for(value_cnt = 0; value_cnt < current.value.length; value_cnt++) {
                result.push(current.value.charCodeAt(value_cnt));
            }
        }

        return result;
    };
    
})(rayson);
