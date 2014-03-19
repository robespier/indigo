
/*
 * GET home page.
 */

var MongoClient = require('mongodb').MongoClient;

exports.data = function(req,res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
		var jobsCollection = db.collection('indigoJobs');
		jobsCollection.find().nextObject(function(err, parcel) {
			res.json( 200, [{ 
				action: 'BlankComposer',
				data: parcel }]
				);
			res.end();
		});
	})
};
