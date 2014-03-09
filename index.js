var express = require('express'),
	cons = require('consolidate'),
	debug = require('debug')('3to:dev');
	app = express();

app.engine('html', cons.mustache);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	var dataValue = 1;
	debug('Index page requested with data = ' + dataValue);
	res.render('index', { data : dataValue });
});

var server = app.listen(8080, function() {
	debug('Listening on port %d', server.address().port);
});