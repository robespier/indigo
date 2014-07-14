var async = require('async');

/**
 * Вставка/обновление списка шаблонов в коллекции `indigoTemplates`
 *
 * 
 */
exports.storeTemplates = {
	running: function(data) {
		var message = data.message,
			templatesCollection = data.req.db.collection('indigoTemplates');

		var templates = message.result.data;
		
		if (typeof(templates) === 'undefined' || (templates.length < 1))  {
			console.info(
				'[%s]: Job %s Templates array is empty ',
				new Date(),
				message._id);
			return;
		}
		async.each(templates, function(t, callback) {
			templatesCollection.findAndModify(
				{name: t.name},
				[],
				t,
				{upsert: true, w: 1},
				callback
			);
		}, function(err) {
			if (err) {
				console.error(
					'[%s]: Job %s failed with %s',
					new Date(),
					message._id,
					err
				);
			}
		});
	},
};
