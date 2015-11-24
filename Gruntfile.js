/*global module:false*/
module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/{,*/}*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['test/coverage/**/*.js']
      },
      lib_test: {
        src: ['lib/{,*/}*.js', 'test/{,*/}*.js']
      }
    },

    instrument: {
      files: 'lib/*.js',
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },
 
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
            mask: '*.spec.js'
        }
      },
      coveralls: {
        src: ['test'],
        options: {
          coverage: true,
          check: {
            lines: 25,
            statements: 25
          },
          root: './lib',
          reportFormats: ['html','lcovonly']
        }
      },
      istanbul_check_coverage: {
        default: {
          options: {
            coverageFolder: 'coverage*',
            check: {
              lines: 80,
              statements: 80
            }
          }
        }
      }
    },
    clean: ['coverage'],
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test'] //, 'qunit'
      }
    }
  });

  grunt.event.on('coverage', function(lcov, done){
      require('coveralls').handleInput(lcov, function(err){
          if (err) {
              return done(err);
          }
          done();
      });
  });


  // Default task.
  grunt.registerTask('default', [ 'concat', 'uglify']); //'mochaTest', removed because jquery

  // Specific tasks
  grunt.registerTask('coveralls', ['mocha_istanbul:coveralls','clean']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage','clean']);
  grunt.registerTask('hint', ['jshint']);

};