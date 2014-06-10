
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var exp = express();

// all environments
exp.set('port', process.env.PORT || 8080);
exp.set('views', __dirname + '/views');
exp.set('view engine', 'jade');
exp.use(express.favicon());
exp.use(express.logger('dev'));
exp.use(express.bodyParser());
exp.use(express.methodOverride());
exp.use(exp.router);
exp.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === exp.get('env')) {
	exp.use(express.errorHandler());
}

exp.all('/data/:1/:2', routes.data);
exp.all('/tests/:1', routes.tests);

http.createServer(exp).listen(exp.get('port'), function(){
	console.log('Express server listening on port ' + exp.get('port'));
});
