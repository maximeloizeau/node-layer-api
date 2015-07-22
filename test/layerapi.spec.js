/*globals describe it*/
'use strict';

var should = require('should');

var fixtures = require('./fixtures.json');

var utils = require('../lib/utils');
var LayerAPI = require('../lib');

var RESOURCES = ['conversations', 'messages', 'announcements'];

describe('Layer API constructor', function() {

  describe('Passing options with full appId', function() {
    it('should throw an error', function() {
      var layerApi = new LayerAPI({token: fixtures.token, appId: fixtures.appIdFull});
      should.exist(layerApi);
    });
  });

  describe('Passing options with token and appId', function() {
    it('should expose API operations', function() {
      var layerApi = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

      RESOURCES.forEach(function(resource) {
        should.exist(layerApi[resource]);
      });

      should(typeof layerApi.conversations.create).be.eql('function');
      should(typeof layerApi.conversations.get).be.eql('function');
      should(typeof layerApi.conversations.edit).be.eql('function');

      should(typeof layerApi.messages.send).be.eql('function');
      should(typeof layerApi.messages.sendTexFromUser).be.eql('function');
      should(typeof layerApi.messages.sendTexFromUser).be.eql('function');

      should(typeof layerApi.announcements.send).be.eql('function');
    });
  });

  describe('Passing no options', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI();
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.token);
      }
    });
  });

  describe('Passing options with token only', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI({token: fixtures.token});
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.appId);
      }
    });
  });

  describe('Passing options with invalid appId', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI({token: fixtures.token, appId: '12345'});
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.appId);
      }
    });
  });
});
