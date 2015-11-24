/*! gitlabclient - v0.0.6 - 2015-11-24
* https://github.com/simonwillcock/GitLabClient
* Copyright (c) 2015 Simon Willcock; Licensed  */
// Uses AMD or browser globals to create a module.

// Grabbed from https://github.com/umdjs/umd/blob/master/amdWeb.js.
// Check out https://github.com/umdjs/umd for more patterns.

// Defines a module "GitLabClient".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory(root));
    } else if (typeof module === 'object' && module.exports) {
        // Mode, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        root.GitLabClient = factory(root.jQuery);
    }
// fix for browserify bug http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
}(typeof global !== 'undefined' ? global : this.window || this.global,
    function ($) {
    'use strict';

    var GitLabClient,
        GitLab;

    GitLabClient = function (options) {
        return new GitLab(options);
    };

    GitLab = function (options) {
        options = options || {};
        options.api = options.api || 'https://gitlab.com/api/v3';
        options.oauth = options.oauth || false;

        var root;

        root = this;
        this.token = options.token;


        this.issues = {
            get: function (data) {
                return _request('GET', '/projects/:id/issues/:issue_id', data);
            },

            list: function (data) {
                return _request('GET', '/projects/:id/issues', data);
            },

            create: function (data) {
                return _request('POST', '/projects/:id/issues', data);
            },

            update: function (data) {
                return _request('PUT', '/projects/:id/issues/:issue_id', data);
            },

            getNote: function (data) {
                return _request('GET', '/projects/:id/issues/:issue_id/notes/:note_id', data);
            },

            listNotes: function (data) {
                return _request('GET', '/projects/:id/issues/:issue_id/notes', data);
            },

            createNote: function (data) {
                return _request('POST', '/projects/:id/issues/:issue_id/notes', data);
            },

            updateNote: function (data) {
                return _request('PUT', '/projects/:id/issues/:issue_id/notes/:note_id', data);
            }
        };

        this.projects = {
            get: function (data) {
                return _request('GET', '/projects/:id', data);
            },

            list: function (data) {
                return _request('GET', '/projects', data);
            },

            create: function (data) {
                return _request('POST', '/projects/:id', data);
            },

            update: function (data) {
                return _request('PUT', '/projects/:id', data);
            },

            getByPath: function (data) {
                return _request('GET', '/project', data);
            },

            search: function (data) {
                return _request('GET', '/projects/search/:query', data);
            },

            fork: function (data) {
                return _request('GET', '/projects/fork/:id', data);
            },

            listEvents: function (data) {
                return _request('GET', '/projects/:id/events', data);
            },

            listLabels: function (data) {
                return _request('GET', '/projects/:id/labels', data);
            },

            createLabel: function (data) {
                return _request('POST', '/projects/:id/labels', data);
            },

            updateLabel: function (data) {
                return _request('PUT', '/projects/:id/labels', data);
            },

            deleteLabel: function (data) {
                return _request('DELETE', '/projects/:id/labels', data);
            },

        };

        var _request = function (method, url, data) {
            var headers = {},
                vars = [];

            if (typeof data === 'undefined') {
                data = {};
            }


            // Fill out URL variables
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (url.indexOf(':' + key) > 0) {
                        url = url.replace(':' + key, data[key]);
                        vars.push(key);
                    }
                }
            }
            // Remove variables from url data;
            for (var i = 0; i < vars.length; i++) {
                delete data[vars[i]];
            }

            if (options.oauth === true) {
                headers.Authorization = 'Bearer ' + root.token;
            } else {
                headers['PRIVATE-TOKEN'] = root.token;
            }

            var deferred = $.Deferred();
            return $.ajax({
                url: options.api + url,
                type: method,
                headers: headers,
                data: (method === 'GET') ? data : JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (error) {
                    deferred.reject(error);
                }
            });
            return deferred.promise();
        };




        return this;

    };

    return GitLabClient;
}));
