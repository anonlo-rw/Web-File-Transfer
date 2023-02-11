require("dotenv").config({path:"../../.env"});

const { Login } = require("./login");
const { GetFiles } = require("./getfiles");
const { DownloadFiles } = require("./download");
const { UploadFiles } = require("./upload");
const { DeleteFiles } = require("./delete");

const port = process.env.SERVER_PORT;
const express = require("express");
const apiRouter = express();

apiRouter.use(require("cors")({origin: '*'}));
apiRouter.use(express.json());

apiRouter.post("/api/login", (request, result) => {
    Login(request, result);
});

apiRouter.post("/api/upload", (request, result) => {
    UploadFiles(request);
});

apiRouter.post("/api/delete", (request, result) => {
    DeleteFiles(request, result);
});

apiRouter.post("/api/download", (request, result) => {
    DownloadFiles(request, result);
});

apiRouter.get("/api/getfiles", (request, result) => {
    GetFiles(result);
});

apiRouter.listen(port);