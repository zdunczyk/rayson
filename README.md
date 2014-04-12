Rayson
======
Rayson is a serializer for JSON data, which produces very small binary output with minimal overhead. It was designed for serializing data with predefined, known structure. The main idea behind algorithm is to extract values from key-value pairs, encode them and store in topological order in byte array. Later when you pass this binary data to unserializer, you will have to provide empty template with key names, which will be filled with decoded values to reconstruct original JSON. This way data can be stored with only one byte overhead per key!

Features
--------

 - optimized for small output - only 1 byte per key overhead (for values/arrays with length below 64 units)
 - safe storage format - keeps tree structure with parent-child relations, whole data is checksumed
 - flexible decoder - fetches only this entries which you actually need
 

Quick start
-----------
Let's say you have some personal data of your customers in object literal: 

    var customers = {
        "update": "2013-04-11 07:03:31",
        "data": [
            {
                "age": 34,
                "name": "Luz Larson",
                "address": "693 Arkansas Drive, Fairforest, North Dakota, 2492"
            },
            {
                "age": 30,
                "name": "Hall Jefferson",
                "address": "432 Dupont Street, Clarktown, Georgia, 1922"
            },
            {
                "age": 32,
                "name": "Camacho Beard",
                "address": "367 Cyrus Avenue, Hondah, Michigan, 7013"
            },
            ( ... )
        ],
        "accepted": [ 0, 2 ] 
    };
    
As you may have noticed, some of the keys repeating all over the place. When `data` array is large, serializing it by simple JSON.stringify or even MessagePack would be an overkill. As long as we know order and structure of `data`'s descendants we can get rid of its keys with Rayson.

    var customers_serialized = rayson.serialize(customers, {
    	root: rayson.type.str,
    	age: rayson.type.int8,
    	accepted: rayson.type.int32
    });
    
`rayson.serialize` gives you binary representation of JSON passed as its first argument. Second argument is a list of keys of serialized literal with types of data they hold. Rayson treats JSON as tree structure with *root* node at the very top of it. When you set type for any internal node, actually you set it for full current subtree (the node with all of its descendants). E.g. setting `root` to `rayson.type.str`, tells serializer that all entries ( `root` is an ancestor for all of them ) in your JSON are unicode strings.
Now `customers_serialized` stores binary data of our customers. Take a look how easily we can decode it.

    var result = rayson.unserialize(customers_serialized, {
    	update: rayson.type.str,
    	customers_data: [{
    		age: rayson.type.int8,
    		first_last_name: rayson.type.str
    	}],
    	accepted: [ rayson.type.int32 ],
    	warnings: [] 
    });

To decode `customers_serialized` we need to provide template as second argument of `rayson.unserialize`. Out template doesn't ideally match structure of initial `customers` literal (it's still perfectly valid), to show flexibility of Rayson templating engine.
The result would be:

    {
        "update": "2013-04-11 07:03:31",
        "customers_data": [
            {
                "age": 34,
                "first_last_name": "Luz Larson"
            },
            {
                "age": 30,
                "first_last_name": "Hall Jefferson"
            },
            {
                "age": 32,
                "first_last_name": "Camacho Beard"
            },
	    (...)
        ],
        "accepted": [ 0, 2 ]
    }



Templates
---------
Rayson tracks number of entries on each level ( between `{}` ) of your JSON and allows you to trim some of the records from the end of it (during unserialization process). You may also add some additional entries to template which haven't existed in original data. In practise it means that if only you append new data at the end of levels it guarantees backward compatibility with all previous versions of your templates (probably in both ways).  
Arrays in templates always contains only one element which defines template for all of the array's children. Samples:

 - multidimensional (also single dimension) array of integers
    ``` 
    [ rayson.type.int32 ]
    ```
 - indie bands each with variable number of albums:
    ``` 
    [ { 
        name: rayson.type.str, 
        albums: [ { 
            year: rayson.type.str,
            name: rayson.type.str
        } ] 
    } ] 
    ``` 

Whenever `[ type ]` in template coresponds to internal node in serialized data, the unserializer will treat full subtree as (multi-) nested array of `type` elements. When in thrid sample above we replace template with `[ rayson.type.str ]` the sample result might be:

    [
        'Foster the People,
        [ 
            [ '2011', 'Torches'],
            [ '2014', 'Supermodel']
        ]
    ]

Types
-----
To use specific type prepend it with `rayson.type` namespace.

`bool` - boolean true/false, or any of truthy/falsy values

`int32` - 32bit un/signed integer

`int8` - 8bit un/signed integer

`raw` - array of bytes

`str` - standard javascript unicode string

You can add your own data type by implementing simple interface. Basicly type object should implement encode and decode methods. Frist of them takes data for encoding and returns array of bytes, second one should be able to reverse this operation. Take a look at *lib/type* directory for some working examples.


Testing
-------
Rayson's tests can be run in browser with jasmine-html-runner, or in console with jasmine-node script.
To run all integration & unit tests in console:

    $ jasmine-node ./tests

To run tests in browser first build a realese:
    
    $ grunt release:my-release
    
Then open `tests/runner/runner.html#my-release`, to run all tests.

Internals
---------
<table>
<tr>
<th>Chunk</th>
<td>Flag</td>
<td colspan="2">Uleb128</td>
<td colspan="2">Uleb128 octet</td>
<td>Uleb128 octet</td>
<td>value ( when isn't internal )</td>
</tr>
<tr>
<th>Type</th>
<td>is internal node</td>
<td>has more octets</td>
<td>size</td>
<td>has more octets</td>
<td>size</td>
<td>(...)</td>
<td>encoded value</td>
</tr>
<tr>
<th>Size</th>
<td>1bit</td>
<td>1bit</td>
<td>6bit</td>
<td>1bit</td>
<td>7bit</td>
<td>8bit</td>
<td>concatenation of sizes from octets</td>
</tr>
</table>

Tree nodes are stored in topological order, which means that each parent comes before all of its children.

TODO
----
- support for 64bit floats
