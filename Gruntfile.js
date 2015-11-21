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
        dest: 'dist/<%= pkg.name %>.v<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.v<%= pkg.version %>.min.js'
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
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument/lib/'
      }
    },
    instrument: {
      files: 'lib/*.js',
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },
    mochacov: {
      coverage: {
        options: {
          coveralls: true
        }
      },
      test: {
        options: {
          reporter: 'spec'
        }
      },
      options: {
        files: 'test/*.js'
      }
    },
    clean: ['test/coverage'],
    reloadTasks : {
      rootPath : 'test/coverage/instrument'
    },
    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },
    makeReport: {
      src: 'test/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports',
        print: 'detail'
      }
    },
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



  // Default task.
  grunt.registerTask('default', [ 'concat', 'uglify']); //'mochaTest', removed because jquery

  // Specific tasks
  grunt.registerTask('test', ['mochacov:test']);
  grunt.registerTask('coverage', ['clean','mochacov:coverage']); //['env:coverage','clean','instrument','reloadTasks','mochaTest','storeCoverage','makeReport']);
  grunt.registerTask('hint', ['jshint']);

};
