// credits to https://github.com/jphpsf
function using(name, values, func){
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);

        var currentSpec = jasmine.currentEnv_.currentSpec;
        if(typeof currentSpec !== 'undefined')
            currentSpec.description += ' (with "' + name + '" using ' + values[i].join(', ') + ')';
    }
}

jasmine.Matchers.prototype.jsonEqual = function(expected) {
    var actual = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, '');
    expected = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

    return actual === expected;
}; 

if(typeof module !== 'undefined')
    module.exports = using;