// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>
// Please view the LICENSE file distributed with this code.

require('../bootstrap.js');

describe("Operation on stream", function() {
    var rayson_stream = null;
    
    beforeEach(function() {
        rayson_stream = new rayson.stream([ 34, 55, 23, 89, 23 ]);   
    });

    it("getting bytes shouldn't change its size", function() {
        var size_before = rayson_stream.size();
        
        rayson_stream.getByte();
        rayson_stream.getByte(3);

        expect(rayson_stream.size()).toEqual(size_before);
    });

    it("reading bytes removes them from stream", function() {
        expect(rayson_stream.readByte()).toEqual(34);    
        expect(rayson_stream.readByte(rayson_stream.size())).toEqual([ 55, 23, 89, 23 ]);
    });

    it("should return true for empty stream", function() {
        stream = new rayson.stream([]);
        expect(stream.empty()).toEqual(true);
    });
});