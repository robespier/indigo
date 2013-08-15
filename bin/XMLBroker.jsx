#include "DataBroker.jsx"

function XMLBroker() {}

XMLBroker.prototype = new dataBroker();
XMLBroker.prototype.constructor = XMLBroker;
XMLBroker.prototype.type = 'xml';

/**
 * Interface realization
 */

XMLBroker.prototype.encode = function (obj) {
	return this.toXML(obj);
},

XMLBroker.prototype.decode = function (string) {
	return this.fromXML(string);
},

XMLBroker.prototype.toXML = function(obj) {

},

XMLBroker.prototype.fromXML = function(string) {
	var inXML = new XML(string);
	var result = {};
	return result;
};
