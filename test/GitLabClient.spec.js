/**
 * gitlabjs
 *
 *    Library test
 */

'use strict';

var assert   = require('assert'),
GitLabClient = require('../lib/GitLabClient'),
jQuery       = require('../node_modules/jquery/dist/jquery');
// requireHelper = require('require_helper');

/* globals it, describe */
describe('gitlabjs init test', function () {
    var url = 'http://10.61.4.51:8011',
    token   = 'abc123';
    // beforeEach(function () {
    //     $ = jQuery = require('jquery');
    // });

    var client = GitLabClient({
        'api': url,
        'token': token,
        'oAuth': true
    });
    it('should return the token passed during initialisation', function () {
        assert.equal(client.token, token);
    });

    // it('should return the url passed during initialisation', function() {
    //     assert.equal(client.url,url);
    // });

});