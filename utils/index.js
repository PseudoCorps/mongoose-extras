exports.search = function( mongoose ) {
  var Model = mongoose.Model
    , Query = mongoose.Query
    , Promise = mongoose.Promise

/*
 * Search on all searchable fields
 * @params {Object} options
 * @params {function} callback
*/

  function generateProjectedFields( prop, projectedFields ) {
    var arr = prop.split('.')
      , l = arr.length;
    
    switch( l ) {
      case 1:
        projectedFields[ prop ] = '$' + prop.toString();
        break;
      case 2: 
        projectedFields[ arr[0] ] = projectedFields[ arr[0] ] || {}; 
        projectedFields[ arr[0] ][ arr[1] ] = '$' + prop.toString();
        break;
      case 3: 
        projectedFields[ arr[0] ] = projectedFields[ arr[0] ] || {};
        projectedFields[ arr[0] ][ arr[1] ] = projectedFields[ arr[0] ][ arr[1] ] || {};
        projectedFields[ arr[0] ][ arr[1] ][ arr[2] ] = '$' + prop.toString();
        break;
      default:
        throw new Error('too many nests in the schema');
    }
  }

  Model.list = function list( options, callback ) {
    if ( !('object' === typeof options || 'function' === typeof callback || 'object' === typeof query) ) {
      throw new Error("wrong argument types");
    }

    if ( !(options.page && options.items) ) {
      throw new Error("first argument must be an object with page and items");
    }

    if ( !options.match ) {
      options.match = {};
    }

    if ( !options.sort ) {
      options.sort = { _id: 1 };
    }
    var projectedFields = {}
      , paths = this.schema.paths
      , promise = new Promise( callback )
      , self = this
      , page = options.page
      , items = options.items
      , skip = items * ( page - 1 )

    for ( var prop in paths ) {
      if ( paths.hasOwnProperty( prop ) && prop !== '__v' && paths[prop]['options']['searchable'] ) {
        generateProjectedFields( prop, projectedFields );
      }
    }

    projectedFields._id = '$_id';

    if ( !Object.keys(projectedFields).length ) {
      return promise.error( new Error("no searchable fields are available in the model") );
    }
    console.log(projectedFields)

    this.aggregate(
      {
        "$match": options.match
      },
      {
        "$group": {
           _id: null,
           count: {
             "$sum": 1
           }
         }
       },
       {
         "$project": {
           _id: 1,
           count: "$count"
         }
       }
     )
    .exec(function( err, result ) {
      if ( err ) {
        return promise.error( err );
      }
      if ( !result.length ) {
        return promise.fulfill( { items: [], count: 0 } );
      }
      self.aggregate(
      {
        "$match": options.match
      },
      {
        "$sort": options.sort
      },
      {
        "$skip": skip
      },
      {
        "$limit": items
      },
      {
        "$project": {
          item: projectedFields
        }
      },
      {
        "$group": {
          _id: null,
          items: {
            "$push": "$item"
          }
        }
      },
      {
        "$project": {
          items: "$items",
            _id: 0
          }
      }, function( err, results ) {
          if ( err ) {
            return promise.error( err );
          }
          if ( !results.length ) {
            return promise.fulfill( { items: [], count: result[0]['count'] } )
          }
          return promise.fulfill( { items: results[0]['items'], count: result[0]['count'] } );
        });
    });
  }
}
