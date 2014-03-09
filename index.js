var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	mustache = require('mustache');

var app = express(),
	viewsDir = path.join(__dirname, 'views'),
	serverPort = 8080;

function getContents(fileName, extension) {
	return fs.readFileSync(path.join(viewsDir, fileName + '.' + extension), 'utf8');
}

function getFile(fileName, extension) {
	var view = getContents(fileName, extension);
	if (!view) {
		throw new Error('Cannot find view for name : "' + fileName + '.' + extension + '"');
	}
	return view;
}

function getView(viewName) {
	return getFile(viewName, 'html');
}

function renderView(viewName, data) {
	var view = getView(viewName);
	return mustache.render(view, data);
}

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.end(renderView('index', { testNum : 1 }));
});

app.listen(serverPort);
console.log('Server started (port : ' + serverPort + ')');