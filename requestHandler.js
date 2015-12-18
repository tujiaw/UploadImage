/**
 * Created by tujiaw on 15/10/30.
 */

var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

function start(response, request) {
    console.log('start');

    var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" enctype="multipart/form-data" method="post">' +
            '<input type="file" name="upload" multiple="multiple">' +
            '<input type="submit" value="upload file" />' +
            '</form>' +
            '</body>' +
            '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log('upload');

    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        fs.renameSync(files.upload.path, './tmp/test.png');
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('received image:<br/>');
        response.write('<img src="/show"/>');
        response.end();
    });
}

function show(response, request) {
    console.log('show');
    fs.readFile('./tmp/test.png', 'binary', function(error, file) {
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

exports.start = start;
exports.upload = upload;
exports.show = show;