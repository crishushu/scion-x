'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        npmEnv: '/Users/crishushu/GoogleDrive/src/node_modules/', // path to node_modules folder
        debugPort: '5951', // debugger port
        connectPort: 35721, // connector port
        base: '.', // path to index
        watch: {
            refresh: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= base %>/lib/*.js',
                    '<%= base %>/scxml/docs/*.xml',
                    '<%= base %>/usage.js',
                    '<%= base %>/index.html'
                ]
            }
        },
        connect: {
            options: {
                port: '<%= debugPort %>',
                hostname: 'localhost',
                livereload: '<%= connectPort %>'
            },
            browser: {
                options: {
                    open: true,
                    base: ['.tmp', '<%= base %>']
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector'],
                options: {
                    logConcurrentOutput: true,
                    limit: 4
                }
            }
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 1337,
                    'web-host': 'localhost',
                    'debug-port': '<%= debugPort %>',
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 4,
                    'hidden': ['node_modules']
                }
            }
        },
        nodemon: {
            dev: {
                script: 'usage.js',
                options: {
                    nodeArgs: ['--debug-brk=<%= debugPort %>'],
                    env: {
                        PORT: '5455'
                    },
                    // omit this property if you aren't serving HTML files and 
                    // don't want to open a browser tab on start
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });
                        // opens browser on initial server start
                        nodemon.on('config:update', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                var url = 'http://localhost:1337/debug?port=' + grunt.config.get('debugPort');
                                require('open')(url);
                            }, 1000);
                        });
                        // refreshes browser when server reboots
                        nodemon.on('restart', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                //require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        bgShell: {
            fileServer: {
                cmd: 'cd scxml && node file-server.js',
                bg: true
            }
        }
    });
    /**
     * Other Requirements:
     * open, node-inspector
     */
    var NPM_ENV = grunt.config.get('npmEnv');
    require(NPM_ENV + 'grunt-contrib-connect/tasks/connect')(grunt);
    require(NPM_ENV + 'grunt-contrib-watch/tasks/watch')(grunt);
    grunt.loadTasks(NPM_ENV + 'grunt-nodemon/tasks');
    grunt.loadTasks(NPM_ENV + 'grunt-concurrent/tasks');
    grunt.loadTasks(NPM_ENV + 'grunt-node-inspector/tasks');
    grunt.loadTasks(NPM_ENV + 'grunt-bg-shell/tasks');

    grunt.registerTask('serve', function(arg) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name, "no args");
        } else {
            switch (arg) {
                case 'browser':
                    grunt.task.run(['connect:browser', 'watch:refresh']);
                    break;
                case 'node':
                    grunt.task.run('concurrent');
                    break;
                default:
                    grunt.log.writeln(this.name, arg, 'is not supported');
            }
        }
    });
    grunt.registerTask('default', ['bgShell', 'concurrent']);
};
