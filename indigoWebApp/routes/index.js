
/*
 * GET home page.
 */

var MongoClient = require('mongodb').MongoClient;

exports.data = function(req,res) {
	var megaSwitch = {
		error: function() {
			var message = {};
			if (req.method === 'POST') {
				message = JSON.parse(req.body.parcel);
				console.log('here');
			}
			res.end();
		},
		info: function() { },
		fetchJobs: function() {
			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				var jobsCollection = db.collection('indigoJobs');
				jobsCollection.find().nextObject(function(err, parcel) {
					res.json( 200, [{ 
						action: 'BlankComposer',
						data: parcel }]
					);
					res.end();
				});
			});
		}
	};
	// req.params[1] пока что всегда 'json'; будут другие дата-брокеры -- будет разговор;
	var action = req.params[2];

	megaSwitch[action]();
};
