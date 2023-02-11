const fs = require("fs");
const path = require("path");

const images = ["png", "jpg", "jpeg", "gif"];
const audio = ["mp3", "wav", "aiff", "flac", "alac", "aac", "dsd"];
const video = ["mp4", "avi", "mov", "wmv", "mkv", "webm"];
let fileData = [];

const filePath = "../files";
const imagesPath = "../images";
const thumbnails = "../files/thumbnails";

function GetFiles(result)
{
    fs.readdir(filePath, (error, files) => {
        files.forEach(file => {
            let fileType = path.extname(file).split(".")[1];
            if (fileType)
            {
                let fileSize = fs.statSync(`${filePath}/${file}`).size
                if (images.indexOf(fileType) > -1) {
                    if (!fs.existsSync(`${thumbnails}/${file}`)) {
                        fileView = fs.readFileSync(`${filePath}/${file}`, {encoding:"base64"});
                    
                    } else fileView = fs.readFileSync(`${thumbnails}/${file}`, {encoding:"base64"});

                } else if (audio.indexOf(fileType) > -1) {
                    fileView = fs.readFileSync(`${imagesPath}/audio.png`, {encoding:"base64"});
                
                } else if (video.indexOf(fileType) > -1) {
                    fileView = fs.readFileSync(`${imagesPath}/video.png`, {encoding:"base64"});
                
                } else fileView = null;

                fileData.push({
                    "view": fileView,
                    "name": file,
                    "type": fileType,
                    "size": fileSize
                });
            }
        });
        result.send(fileData);
        fileData = [];
    });
}
module.exports = { GetFiles }