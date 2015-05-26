/* Copyright (c) 2012-2015 LevelUP contributors
 * See list at <https://github.com/level/levelup#contributing>
 * MIT License <https://github.com/level/levelup/blob/master/LICENSE.md>
 */

var levelup = require('../lib/levelup.js')
  , errors  = levelup.errors
  , fs      = require('fs')
  , common  = require('./common')

  , assert  = require('referee').assert
  , refute  = require('referee').refute
  , buster  = require('bustermove')
  , MemDOWN = require('memdown')

buster.testCase('Init & open()', {
    'setUp': common.commonSetUp
  , 'tearDown': common.commonTearDown

  , 'levelup()': function () {
      assert.isFunction(levelup)
      assert.exception(levelup, 'InitializationError') // no db
    }

  , 'default options': function (done) {
      var db

      common.openTestBackend(function (err, backend) {
        refute(err)
        db = levelup({ createIfMissing: true, errorIfExists: true, db: backend })

        this.closeableDatabases.push(db)

        db.close(function (err) {
          refute(err)
          backend.open(function (err) {
            refute(err)

            db = levelup({ db: backend }) // default options
            refute(err)
            assert.isObject(db)
            assert.isTrue(db.options.createIfMissing)
            assert.isFalse(db.options.errorIfExists)
            assert.equals(db.options.keyEncoding, 'utf8')
            assert.equals(db.options.valueEncoding, 'utf8')

            done()
          }.bind(this))
        }.bind(this))
      }.bind(this))
    }

  , 'basic options': function (done) {
      common.openTestBackend(function (err, backend) {
        refute(err)
        var db = levelup({
            createIfMissing: true
          , errorIfExists: true
          , valueEncoding: 'binary'
          , db: backend
        })

        this.closeableDatabases.push(db)
        assert.isObject(db)
        assert.isTrue(db.options.createIfMissing)
        assert.isTrue(db.options.errorIfExists)
        assert.equals(db.options.keyEncoding, 'utf8')
        assert.equals(db.options.valueEncoding, 'binary')

        done()
      }.bind(this))
    }

  , 'options with encoding': function (done) {
      common.openTestBackend(function (err, backend) {
        refute(err)

        var db = levelup({
            db: backend
          , createIfMissing: true
          , errorIfExists: true
          , keyEncoding: 'ascii'
          , valueEncoding: 'json'
        })

        this.closeableDatabases.push(db)
        assert.isObject(db)
        assert.isTrue(db.options.createIfMissing)
        assert.isTrue(db.options.errorIfExists)
        assert.equals(db.options.keyEncoding, 'ascii')
        assert.equals(db.options.valueEncoding, 'json')

        done()
      }.bind(this))
    }
})
