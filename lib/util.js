// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    // some random value, uniquely indetifies Type objects
    var TYPE_FLAG = (new Date()).getTime() - 100;
    var TYPE_FLAG_KEY = 'typeflag';

    var NODE_FLAG = (new Date()).getTime();
    var NODE_FLAG_KEY = 'nodeflag';
    
    var NODE_UNIQUE_KEY = (new Date()).getTime();

    function isSpecialObject(obj, special_key, special_flag) {
        return (typeof obj[special_key] !== 'undefined') 
                && (obj[special_key] === special_flag); 
    }
    
    function isInstance(obj, type) {
        return {}.toString.call(obj) === '[object ' + type + ']';
    }

    bundle.util = {
        isNumeric: function(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);           
        },
        isStream: function(obj) {
            return this.isObject(obj) && (typeof obj.readByte === 'function');
        },
        isArray: function(val) {
            return isInstance(val, 'Array');           
        },
        isObject: function(val) {
            return isInstance(val, 'Object');           
        },
        isUndefined: function(val) {
            return typeof val === 'undefined';    
        },
        isNode: function(val) {
            return this.isObject(val) && isSpecialObject(val, NODE_FLAG_KEY, NODE_FLAG); 
        },
        isParentNode: function(val) {
            return this.isArrayNode(val) || this.isObjectNode(val);        
        },
        isArrayNode: function(val) {
            return this.isNode(val) && val.type === rayson.node.TYPE_ARRAY;
        },
        isObjectNode: function(val) {
            return this.isNode(val) && val.type === rayson.node.TYPE_OBJ;
        },
        size: function(val) {
            if(this.isArray(val))
                return val.length;

            var key, size = 0;
            for(key in val)
                if(val.hasOwnProperty(key)) size++;

            return size;
        },
        setNodeFlag: function(obj) {
            if(this.isObject(obj))
                obj[NODE_FLAG_KEY] = NODE_FLAG;
            
            return obj;
        },
        isType: function(val) {
            return this.isObject(val) && isSpecialObject(val, TYPE_FLAG_KEY, TYPE_FLAG);
        },
        setTypeFlag: function(obj) {
            if(this.isObject(obj))
                obj[TYPE_FLAG_KEY] = TYPE_FLAG;
            
            return obj;
        }
    };

})(rayson);