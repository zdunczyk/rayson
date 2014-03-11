// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

var rayson = rayson || {};

(function(bundle) {

    function isInstance(obj, type) {
        return {}.toString.call(obj) === '[object ' + type + ']';
    }

    bundle.util = {
        isNumeric: function(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);           
        },
        isStream: function(obj) {
            return (typeof obj.readByte === 'function');
        },
        isArray: function(val) {
            return isInstance(val, 'Array');           
        },
        isObject: function(val) {
            return isInstance(val, 'Object');           
        }
    };

})(rayson);