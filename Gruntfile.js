module.exports = function(grunt) {
    var external = {
        release_name: 'test',
        release_dir: 'release'
    };

    grunt.initConfig({
        external: external,
        uglify: {
            options: {
                banner: "// Rayson package   (c) Tomasz Zduńczyk <tomasz@zdunczyk.org>\
                       \n// Please view the LICENSE file distributed with this code. \n\n",
                report: 'min'
            },
            release: {
                files: {
                    '<%= external.release_dir %>/<%= external.release_name %>.min.js': ['<%= concat.release.dest %>']
                }
            }
        },
        concat: {
            options: { 
                separator: ';'
            },
            release: {
                src: [ 'lib/*.js', 'lib/type/*.js' ],
                dest: '<%= external.release_dir %>/<%= external.release_name %>.js'
            }
        },
        testpack: {
            specdirs: [ 'tests/unit', 'tests/integration' ],
            packdir: 'tests/pack'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('testpack', function() {
        var paths = [];
        
        (grunt.config('testpack.specdirs')).forEach(function(dir) {
            grunt.file.recurse(dir, function(abspath) {
                paths.push(abspath);    
            });
        });
        
        grunt.file.write(grunt.config('testpack.packdir') + '/' + external.release_name + '.js', 
            'var testpack = ' + JSON.stringify(paths)
        );
    });

    grunt.registerTask('release', function(name) {
        if(name)
            external.release_name = name;

        grunt.task.run('concat');
        grunt.task.run('uglify');
        grunt.task.run('testpack');

        grunt.file.delete(external.release_dir + '/' + name + '.js');
    });
};