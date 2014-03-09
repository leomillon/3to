var express = require('express'),
	cons = require('consolidate'),
	debug = require('debug')('3to:dev');
	app = express();

app.engine('html', cons.mustache);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	var dataValue = Date.now();
	debug('Index page requested with data = ' + dataValue);
	res.render('index', { 
			data : dataValue,
			util: {
				date: {
					date: function () {
						return function(text, render) {
							var textValue = render(text),
								timestamp = parseInt(textValue),
								date = new Date(timestamp);
							debug("text = " + text);
							debug("textValue = " + textValue);
							debug("timestamp = " + timestamp);
							debug("date = " + date);
							return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
						}
					}
				}
			}
		});
});

var server = app.listen(8080, function() {
	debug('Listening on port %d', server.address().port);
});