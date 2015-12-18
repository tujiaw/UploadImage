/**
 * Created by tujiaw on 15/10/30.
 */
var http = require('http');
var url = require('url');
var formidable = require('formidable');

function start(route, handle) {
    http.createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log('request pathname:' + pathname);
        route(handle, pathname, response, request);
    }).listen(8888);
}

exports.start = start;