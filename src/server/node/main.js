const { Login } = require("./login");
const { GetFiles } = require("./getfiles");
const { DownloadFiles } = require("./download");
const { UploadFiles } = require("./upload");
const { DeleteFiles } = require("./delete");

const port = 80;
const express = require("express");
const apiRouter = express();

apiRouter.use(require("cors")({origin: '*'}));
apiRouter.use(express.json());

apiRouter.post("/api", (request, result) => {
    if (request.query.act == "login") {
        Login(request, result);

    } else if (request.query.act == "upload") {
        UploadFiles(request);
    
    } else if (request.query.act == "delete") {
        DeleteFiles(request, result);
    
    } else if (request.query.act == "download") {
        DownloadFiles(request, result);
    }
});

apiRouter.get("/api", (request, result) =>
{
    if (request.query.act == "getfiles") {
        GetFiles(result);
    }
});

apiRouter.listen(port);