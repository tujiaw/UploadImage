/**
 * Created by tujiaw on 15/10/30.
 */

function route(handle, pathname, response, request) {
    console.log('route');
    if (typeof handle[pathname] ===  'function') {
        handle[pathname](response, request);
        return;
    }
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write('404 Not found');
    response.end();
}

exports.route = route;