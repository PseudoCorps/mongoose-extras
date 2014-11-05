module.exports = function( mongoose ) {
  var Types = mongoose.Schema.Types
    , util = require('util') 
    , SchemaType = mongoose.SchemaType
    , CastError = SchemaType.CastError
    , regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
    

/**
 * IP Schema Type constructor
 *
 * @param {String} key
 * @param {Object} options
 * @inherits SchemaType
 * @api private
*/

  function IP( key, options ) {
    SchemaType.call( this, key, options, 'IP' );
  };

/*!
 * Inherits from SchemaType.
*/

  IP.prototype = Object.create( SchemaType.prototype );
  IP.prototype.constructor = IP;

/**
 * Required validator for ip
 * @param {}
 * @api private
*/

  IP.prototype.checkRequired = function checkRequired (value, doc) {
    if (SchemaType._isRef(this, value, doc, true)) {
      return null != value;
    } else {
      return (value instanceof String || typeof value == 'string') && value.length;
    }
  };

/**
 * Casts to ip String
 *
 * @param {Object} value to cast
 * @api private
 */

  IP.prototype.cast = function( value ) {
    if ( value === null || value === '' ) {
      return null;
    }
  
    if ( !regex.test( value ) || 'undefined' === typeof value ) {
      throw new CastError( 'ip', value, this.path );
    }

    if ( 'string' === typeof value ) {
      return value; 
    } 
  
    if ( value.toString ) {
      return value.toString();
    }
    return value.toString();

  };

/*!
 * ignore
 */

  function handleSingle( val ) {
    return this.castForQuery( val );
  }

  function handleArray( val ) {
    var self = this;
    return val.map(function( m ) {
      return self.castForQuery( m );
    });
  }

  IP.prototype.$conditionalHandlers = {
      '$ne' : handleSingle
    , '$in' : handleArray
    , '$nin': handleArray
    , '$gt' : handleSingle
    , '$lt' : handleSingle
    , '$gte': handleSingle
    , '$lte': handleSingle
    , '$all': handleArray
    , '$regex': handleSingle
    , '$options': handleSingle
  };

/**
 * Casts contents for queries.
 *
 * @param {String} $conditional
 * @param {any} [val]
 * @api private
 */

  IP.prototype.castForQuery = function( $conditional, val ) {
    var handler;
    if ( arguments.length === 2 ) {
      handler = this.$conditionalHandlers[ $conditional ];
      if ( !handler )
        throw new Error("Can't use " + $conditional + " with IP.");
      return handler.call( this, val );
    } else {
      val = $conditional;
      if ( val instanceof RegExp ) return val;
      return this.cast( val );
    }
  };
  
  
  
  return mongoose.Schema.Types.IP = IP;
}

