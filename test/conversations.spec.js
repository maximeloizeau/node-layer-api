/*globals describe it*/
'use strict';

var should = require('should');
var nock = require('nock');

var fixtures = require('./fixtures.json');
var utils = require('../lib/utils');

var LayerAPI = require('../lib');
var layerAPI = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

describe('Conversation operations', function() {

  describe('Creating a conversation with participants', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations')
      .reply(201, fixtures.conversations.success);

    it('should return a conversation object', function(done) {
      layerAPI.conversations.create({participants: fixtures.conversations.success.participants}, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.conversations.success);

        done(err);
      });
    });
  });

  describe('Creating a conversation with empty body', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations')
      .reply(422, fixtures.conversations.error.missing);

    it('should return an error', function(done) {
      layerAPI.conversations.create({}, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.status.should.be.eql(422);
        err.body.should.have.properties(fixtures.conversations.error.missing);

        done();
      });
    });
  });

  describe('Retrieving a conversation by conversation ID', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid)
      .reply(200, fixtures.conversations.success);

    it('should return a conversation object', function(done) {
      layerAPI.conversations.get(fixtures.conversations.uuid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.have.properties(fixtures.conversations.success);

        done(err);
      });
    });
  });

  describe('Editing a conversation by conversation ID', function() {
    nock('https://api.layer.com')
      .patch('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid)
      .reply(204);

    var operations = [
      {operation: 'add', property: 'participants', value: 'user1'},
      {operation: 'remove', property: 'participants', value: 'user1'},
      {operation: 'set', property: 'participants', value: ['user1', 'user2', 'user3']}
    ];

    it('should return a 204', function(done) {
      layerAPI.conversations.edit(fixtures.conversations.uuid, operations, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });

  describe('Editing a conversation by passing invalid operations', function() {
    var operations = 'bla';

    it('should return an error', function(done) {
      layerAPI.conversations.edit(fixtures.conversations.uuid, operations, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.conversations.operations);
        should.not.exist(res);

        done();
      });
    });
  });

  describe('Retrieving a conversation by non-existent conversation ID', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid)
      .reply(404);

    it('should return 404', function(done) {
      layerAPI.conversations.get(fixtures.conversations.uuid, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.status.should.be.eql(404);

        done();
      });
    });
  });

  describe('Creating a conversation by passing the wrong body', function() {
    it('should return an error', function(done) {
      layerAPI.conversations.create(123, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.conversations.body);
        should.not.exist(res);

        done();
      });
    });
  });

  describe('Retrieving a conversation by passing the wrong ID', function() {
    it('should return an error', function(done) {
      layerAPI.conversations.get(123, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.conversations.id);
        should.not.exist(res);

        done();
      });
    });
  });

  describe('Retrieving a conversation by passing the wrong ID', function() {
    it('should return an error', function(done) {
      layerAPI.conversations.get('bla-bla', function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.conversations.id);
        should.not.exist(res);

        done();
      });
    });
  });
});