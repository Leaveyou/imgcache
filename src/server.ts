import application from "./application";
import * as config from "./utils/config";
const port = config.PORT;
application.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});
