/* global it, describe */
/**
 * gitlabjs
 *
 *    Library test
 */

'use strict';

var assert   = require('assert'),
GitLabClient = require('../lib/GitLabClient'),
sinon        = require('../node_modules/sinon/lib/sinon'),
jsdom        = require('jsdom');
// requireHelper = require('require_helper');


describe('gitlabjs init test', function () {
    var token   = 'abc123',
        $;

    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = {userAgent: 'node.js'};

    var client = GitLabClient({
        'api': 'http://10.61.4.51:8011',
        'token': token,
        'oAuth': true

    });
    before(function(){
        $ = require('../node_modules/jquery/dist/jquery')(window);
    });
    beforeEach(function(){
        sinon
            .stub($, 'ajax');
    });

    afterEach(function(){
        $.ajax.restore();
    });

    it('should return the token passed during initialisation', function () {
        assert.equal(client.token, token);
    });

    it('should make an ajax call', function (done) {
        client.projects.get({id: 1});
        assert.equal($.ajax.calledOnce, true);
        done();
    });

});