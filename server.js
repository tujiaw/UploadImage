/**
 * Created by tujiaw on 15/10/30.
 */
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var formidable = require('formidable');
var socketio = require('socket.io');

function start(route, handle) {
    var server = http.createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log('request pathname:' + pathname);
        route(handle, pathname, response, request);
    });
    server.listen(8888, function() {
        console.log('server listening on port:8888.');
    });
    var io = socketio.listen(server);
    route(handle, 'setIO', io);
}

exports.start = start;