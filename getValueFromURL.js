var http = require("http");
var url = require("url");
var querystring = require("querystring");

function onRequest(request, response) {
  //url : http://localhost:8888/start?foo=bar&hello=world
  var pathname = url.parse(request.url).pathname;
  var query = url.parse(request.url, true).query;
  var foo = query.foo;
  var hello = query.hello;
  console.log("Request for " + pathname + " received.");
  console.log("Query : " + query);
  console.log("URL : " + request.url);
  console.log("Foo : " + foo);
  console.log("Hello : " + hello);
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

http.createServer(onRequest).listen(8888);

console.log("Server has started.");
