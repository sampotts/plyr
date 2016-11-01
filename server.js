var express = require('express');
var morgan = require('morgan');
var app = express();
var fs = require('fs');
var compression = require('compression');
var crypto = require('crypto');

var http = require('http').createServer(app);

var HTTP_PORT = 8080;

app.use(morgan('combined'));
app.use(compression());

/* ------------------------ TEST URLS ------------------------*/
app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/test', function(req, res) {
	res.send(fs.readFileSync(__dirname + '/test.html', 'utf-8'));
});

app.get('/cast', function(req, res) {
	res.send(fs.readFileSync(__dirname + '/cast.html', 'utf-8'));
});
/* -------------------- END OF TEST URLS --------------------*/

app.use('/src', express.static('./src'));
app.use('/dist', express.static('./dist'));


http.listen(HTTP_PORT, function () {
	console.log('HTTP listening on port ' + HTTP_PORT);
});

