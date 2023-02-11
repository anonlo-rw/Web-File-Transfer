const formidable = require("formidable");
const sharp = require("sharp");
const fs = require("fs");

const filePath = "../files";
const thumbnails = "../files/thumbnails";

function UploadFiles(request)
{
    let form = new formidable.IncomingForm();
    let files = [];

    form.on("file", function(field, file) {
        files.push([field, file]);
    });
    form.on("end", function() {
        files.forEach(file => {
            fs.rename(
                file[1].filepath,
                `${filePath}/${file[1].originalFilename}`,
                (error) => null,
            );
        });

        files.forEach(thumbnail => {
            sharp(`${filePath}/${thumbnail[1].originalFilename}`)
            .resize(100, 100)
            .toFile(
                `${thumbnails}/${thumbnail[1].originalFilename}`,
                (error) => null,
            );
        })
    });
    form.parse(request);
}
module.exports = { UploadFiles }