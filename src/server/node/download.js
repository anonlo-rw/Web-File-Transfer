const zip = require("adm-zip");
const fs = require("fs");

const filePath = "../files";
const zipName = "files.zip";

function DownloadFiles(request, result)
{
    const files = request.body;
    const zipFile = new zip();

    if (files.length === 1) {
        result.download(`${filePath}/${files}`);
    
    } else {
        files.forEach(file => {
            zipFile.addLocalFile(`${filePath}/${file}`);
        });
        zipFile.writeZip(zipName);
        result.download(zipName, () => fs.unlinkSync(zipName));
    }
}
module.exports = { DownloadFiles }