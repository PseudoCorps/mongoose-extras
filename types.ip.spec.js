/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , IPModule = require('../')
  , sinon = require('sinon')
  , expect = require('chai').expect
  , Schema = mongoose.Schema
  , SchemaIP
  , IP

/**
 * Test.
 */

describe('types.ip', function(){

  before(function() {
    IPModule( mongoose );
    SchemaIP = mongoose.Schema.Types.IP;
  });

  it('an empty ip casts to null', function( done ) {
    var n = new SchemaIP();
    expect(  n.cast('') ).to.be.null;
    done();
  });

  it('a null ip should castForQuery to null', function( done ) {
    var n = new SchemaIP();
    expect( n.castForQuery(null) ).to.be.null;
    done();
  })

  it('undefined throws ip cast error', function( done ) {
    var n = new SchemaIP();
    var err;
    try {
      n.cast( undefined );
    } catch( e ) {
      err = e;
    }
    expect( err ).to.be.an.instanceof( Error );
    done();
  })

  it('array throws cast ip error', function( done ) {
    var n = new SchemaIP();
    var err;
    try {
      n.cast([]);
    } catch (e) {
      err = e;
    }
    expect( err ).to.be.an.instanceof( Error );
    done();
  })

  it('non ip format throws cast ip error', function (done) {
    var n = new SchemaIP();
    var err;
    try {
      n.cast('1.12.23');
    } catch (e) {
      err = e;
    }
    expect( err ).to.be.an.instanceof( Error );
    done();
  })

  it('{} throws cast ip error', function( done ) {
    var n = new SchemaIP();
    var err;
    try {
      n.cast({});
    } catch (e) {
      err = e;
    }
    expect( err ).to.be.an.instanceof( Error );
    done();
  })

  it('can be used in schemas', function(){
    var s = new Schema({ ip: 'IP' });
    var ip = s.path('ip')
    expect( ip instanceof mongoose.SchemaType ).to.be.true;
    expect( typeof ip.get ).to.equal('function');

    var s = new Schema({ ip: SchemaIP });
    var ip = s.path('ip')
    expect( ip instanceof mongoose.SchemaType ).to.be.true;
    expect( typeof ip.get ).to.equal('function');
  });
  
  describe('integration', function(){
    var db, S, schema, id, b;

    before(function( done ){
     db = mongoose.connect('mongodb://localhost/test');
      schema = new Schema( { ip: SchemaIP, name: {type: String, searchable: true}, docs: [{ title: String }], custom: {} } );
      S = db.model( 'SAP', schema );
      done();
    });

    after(function( done ) {
      S.remove().exec(function() {
        db.connection.close(function() {
         done();
        });
      });
    });

   it('cannot save wrong ip', function( done ) {
      var s = new S({ ip: '1.2.3', name: 'Skyler', docs: [{ title: 'Jesse' }] });
      s.save(function ( err ) {
        expect( err ).to.be.an.instanceof( Error )
        done();
      });
    });

   it('can save ip', function( done ) {
     var s = new S({ ip: '122.140.201.66', name: 'Skyler', docs: [{ title: 'Jesse' }], custom: {domaine: String} });
      s.save(function ( err, item ) {
        expect( err ).to.not.exist;
        done();
      });
    });


    /*
     * Make sure to index the saps collection for text search directly in mongo otherwise
     * this test will fail
     */
    
   it('can save ip only if it is a string', function( done ){
      var s = new S({ ip: 122.140, name: 'Skyler', docs: [{ title: 'Jesse' }] });
      s.save(function ( err ) {
        expect( err ).to.be.an.instanceof( Error );
        done();
      });
    });

   it('can be required', function(done){
     var s = new Schema({ ip: { type: SchemaIP, required: true }});
     mongoose.model('required', s);
     var req = mongoose.model('required');
     m = new req();
     m.save(function ( err ) {
       expect( err ).to.be.an.instanceof( Error );
       done();
     })
   })
  })
})
