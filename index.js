var express = require('express'),
	cons = require('consolidate'),
	app = express();

var serverPort = 8080;

app.engine('html', cons.mustache);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	res.render('index', { testNum : 1 });
});

app.listen(serverPort);
console.log('Server listening on port ' + serverPort);