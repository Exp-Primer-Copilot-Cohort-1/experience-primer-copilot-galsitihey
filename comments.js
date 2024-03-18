// Create web server
// 1. Create a web server
// 2. Create a route
// 3. Send a response

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var comments = [];
var data = fs.readFileSync('./comments.json');
if(data.length > 0){
	comments = JSON.parse(data);
}

http.createServer(function(req, res){
	var urlObj = url.parse(req.url, true);
	if(urlObj.pathname === '/'){
		var homePage = fs.readFileSync('./index.html');
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(homePage);
	} else if(urlObj.pathname === '/comments' && req.method === 'GET'){
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(comments));
	} else if(urlObj.pathname === '/comments' && req.method === 'POST'){
		var comment = '';
		req.on('data', function(chunk){
			comment += chunk;
		});
		req.on('end', function(){
			comments.push(JSON.parse(comment));
			fs.writeFileSync('./comments.json', JSON.stringify(comments));
			res.end('Thanks for the comment');
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end('<h1>Not Found</h1>');
	}
}).listen(8080);
console.log('Server started at http://localhost:8080');