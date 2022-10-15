<?php
header("Access-Control-Allow-Origin:*");
ini_set("memory_limit", "5000M");

const IMAGE_HANDLERS = [
    IMAGETYPE_JPEG => [
        "load" => "imagecreatefromjpeg",
        "save" => "imagejpeg",
        "quality" => 100
    ],
    IMAGETYPE_PNG => [
        "load" => "imagecreatefrompng",
        "save" => "imagepng",
        "quality" => 0
    ],
    IMAGETYPE_GIF => [
        "load" => "imagecreatefromgif",
        "save" => "imagegif"
    ]
];

function createThumbnail($src, $dest, $targetWidth, $targetHeight = null) {
    $type = exif_imagetype($src);
    if (!$type || !IMAGE_HANDLERS[$type]) {
        return null;
    }

    $image = call_user_func(IMAGE_HANDLERS[$type]["load"], $src);
    if (!$image) {
        return null;
    }

    $width = imagesx($image);
    $height = imagesy($image);
    if ($targetHeight == null) {
        $ratio = $width / $height;
        if ($width > $height) {
            $targetHeight = floor($targetWidth / $ratio);
        } else {
            $targetHeight = $targetWidth;
            $targetWidth = floor($targetWidth * $ratio);
        }
    }

    $thumbnail = imagecreatetruecolor($targetWidth, $targetHeight);
    if ($type == IMAGETYPE_GIF || $type == IMAGETYPE_PNG) {
        imagecolortransparent(
            $thumbnail,
            imagecolorallocate($thumbnail, 0, 0, 0)
        );

        if ($type == IMAGETYPE_PNG) {
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);
        }
    }
    imagecopyresampled(
        $thumbnail,
        $image,
        0, 0, 0, 0,
        $targetWidth, $targetHeight,
        $width, $height
    );
    return call_user_func(
        IMAGE_HANDLERS[$type]["save"],
        $thumbnail,
        $dest,
        IMAGE_HANDLERS[$type]["quality"]
    );
}

$files = "../files/";
$thumbnails = "../files/thumbnails/";
$images = array("png", "jpg", "jpeg", "gif");

if (isset($_FILES["files"]))
{
    for ($file = 0; $file < count($_FILES["files"]["name"]); $file++) {
    	$newFile = $_FILES["files"]["name"][$file];
    	$fileType = strtolower(pathInfo($newFile, PATHINFO_EXTENSION));
    
        move_uploaded_file(
            $_FILES["files"]["tmp_name"][$file],
            $files . $newFile
        );
       	
       	if (in_array($fileType, $images)) {
       	    createThumbnail($files . $newFile, $thumbnails . $newFile, 28, 28);
       	}
    }
}
?>