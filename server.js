var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: '' });
var clients = {};

// Broadcast to all clients
function broadcast(message){
  // iterate through each client in clients object
  for (var client in clients){
    // send the message to that client
    clients[client].write(message);
  }
}

echo.on('connection', function(conn) {
    // add this client to clients object
    console.log("connect: " + conn.id);
    clients[conn.id] = conn;
    conn.on('data', function(message) {
        console.log(message)
        broadcast(message);
    });
    // on connection close event
    conn.on('close', function() {
      console.log("disconnect: " + conn.id);
      delete clients[conn.id];
    });
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
});
echo.installHandlers(server, {prefix:'/chat'});
server.listen(process.env.PORT||9999);