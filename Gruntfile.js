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
            dist: {
                files: {
                    '<%= external.release_dir %>/<%= external.release_name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        concat: {
            options: { 
                separator: ';'
            },
            dist: {
                src: [ 'lib/**/*.js' ],
                dest: '<%= external.release_dir %>/<%= external.release_name %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('release', function(name) {
        if(name)
            external.release_name = name;

        grunt.task.run('concat');
        grunt.task.run('uglify');

        grunt.file.delete(external.release_dir + '/' + name + '.js');
    });
};