module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mkdir: {
            all: {
                options: {
                    create: ['dist']
                }
            }

        },
        concat: {
            options: {
                separator: ';',
                stripBanners: {
                    options: {
                        block: true,
                        line: true
                    }
                }
            },
            files: {
                src: ['js/mapView.js', 'js/places.js', 'js/placesService.js', 'js/viewModel.js'],
                dest: 'dist/scripts.min.js'
            }
        },
        concat_css: {
            options: {},
            files: {
                src: ['css/normalize.css', 'css/style.css'],
                dest: 'dist/styles.min.css'
            }
        },
        uglify: {
            options: {},
            files: {
                src: ['dist/scripts.min.js'],
                dest: 'dist/scripts.min.js'
            }

        },
        cssmin: {
            options: {},
            files: {
                src: 'dist/*.css',
                dest: 'dist/styles.min.css'
            }
        },
        processhtml: {
            build: {
                files: {
                    'dist/index.html': ['index.html']
                }
            }
        },
        clean: {
            all: {
                files: [{
                    src: ['dist']
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-concat-css');

    grunt.registerTask('default', ['clean', 'mkdir', 'concat_css', 'concat', 'cssmin', 'uglify', 'processhtml']);
};