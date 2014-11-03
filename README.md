#Mongoose Utils
=====================================

Provides Custom Schema Types support for [Mongoose](http://mongoosejs.com).

Example:

```js
var mongoose = require('mongoose')
require('mongoose-utils')( mongoose );

//inside your model
var Schema = mongoose.Schema
  , IP = mongoose.Schema.Types.IP
  , exampleSchema = new Schema({ ipAddress: IP });

//or
var Schema = mongoose.Schema
  , exampleSchema = new Schema({ ipAddress: 'IP' });
```

#Search Example:
```js
//in mongoose schema make sure you have a flag on searchable fields example
var exampleSchema = new Schema({ ipAddress: IP, searchable: true });
	,	Collection = mongoose.model('collection');
	,	options
//search the the first 10 records on the collection where ip matches 127.0.0.1
options = {
	items: 10,
	page: 1,
	match: {
		ipAddress: '127.0.0.1'
	}
}

Collection.list( options, function( err, collections ) {
	//parse your callback just like any other mongoose callbacks.
});
```