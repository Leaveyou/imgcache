import application from "./application";

const port = 8080;
application.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});
