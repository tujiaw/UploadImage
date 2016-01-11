/**
 * Created by tujiaw on 15/10/30.
 */

var url = require('url');
var fs = require('fs');
var formidable = require('formidable');

var io;
var clients = {};
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: You explored an unknown page!');
    response.end();
}

function start(response, request) {
    console.log('start');
    fs.readFile('./index.html', function(err, data) {
       if (err) {
           send404(response);
       } else {
           response.writeHead(200, {"Content-Type": "text/html"});
           response.write(data);
           response.end();
       }
    });
}

function upload(response, request) {
    console.log('upload');

    var params = url.parse(request.url, true).query;
    var socketId = params.socketId;

    var form = new formidable.IncomingForm();
    form.uploadDir = './tmp/';
    form.parse(request, function(error, fields, files) {
        if (error) {
            console.log(error);
        } else {
            fs.renameSync(files.upload.path, './tmp/' + files.upload.name);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<a href="/">Home</a> received image:<br/>');
            response.write('<img src="/show?name=' + files.upload.name + '"/>');
            response.end();
        }
    });

    (function(socketId) {
        form.on('progress', function(bytesReceived, bytesExpected) {
            var percent = Math.floor(bytesReceived / bytesExpected * 100);
            clients[socketId].emit('process', {success: true, percent: percent});
        });
    }(socketId));
}

function show(response, request) {
    console.log('show');
    var params = url.parse(request.url, true).query;
    var path = './tmp/' + params.name;
    console.log('path:' + path);
    fs.readFile(path, 'binary', function(error, file) {
        if (error) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write(error + '\n');
            response.end();
        } else {
            response.writeHead(200, {'Content-Type': 'image/png'});
            response.write(file, 'binary');
            response.end();
        }
    });
}

function setIO(myIO) {
    io = myIO;
    io.sockets.on('connection', function(socket) {
        var id = socket.id.substr(2);
        console.log('connection, socket:' + socket.id);
        socket.emit('socketId', {success: true, socketId: id});
        clients[id] = socket;

        socket.emit('beartbeat');
        socket.on('heartbeat', function() {
           socket.heartbeat =  Date.now();
        });
    });

    setInterval(function() {
        for (var index in clients) {
            if (Date.now() - clients[index].heartbeat > 10000) {
                delete clients[index];
            } else {
                clients[index].emit('heartbeat');
            }
        }
    }, 3000);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.setIO = setIO;