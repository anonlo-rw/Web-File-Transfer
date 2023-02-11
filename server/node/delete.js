const fs = require("fs");

function DeleteFiles(request, result)
{
    const files = request.body;
    files.forEach(file => {
        let defaultFile = `../files/${file}`;
        let thumbnailFile = `../files/thumbnails/${file}`;

        if (fs.existsSync(defaultFile)) fs.unlinkSync(defaultFile);
        if (fs.existsSync(thumbnailFile)) fs.unlinkSync(thumbnailFile);
    });
    result.status(200).send("success");
}
module.exports = { DeleteFiles }