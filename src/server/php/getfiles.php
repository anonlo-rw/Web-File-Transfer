<?php
header("Access-Control-Allow-Origin:*");
ini_set("memory_limit", "5000M");
// include("session.php");

$images = array("png", "jpg", "jpeg", "gif");
$videos = array("mp4", "avi", "mov", "wmv", "mkv", "webm");
$audio = array("mp3", "wav", "aiff", "flac", "alac", "aac", "dsd");
$files = array();

$path = "../files/";
$thumbnails = "../files/thumbnails/";

if ($handle = opendir($path)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
			$fileType = strtolower(pathInfo($entry, PATHINFO_EXTENSION));
			
			if ($fileType != null) {
				if (in_array($fileType, $images)) {
					if (!file_exists($thumbnails . $entry)) {
						$fileView = base64_encode(file_get_contents($path . $entry));
						
					} else { $fileView = base64_encode(file_get_contents($thumbnails . $entry)); }
					
				} else if (in_array($fileType, $videos)) {
					$fileView = base64_encode(file_get_contents("../images/video.png"));
					
				} else if (in_array($fileType, $audio)) {
					$fileView = base64_encode(file_get_contents("../images/audio.png"));
				
				} else {
					$fileView = null;
				}
			
				array_push($files, [
					"view" => $fileView,
					"name" => $entry,
					"type" => $fileType,
					"size" => filesize($path . $entry)
				]);
			}
        }
    }
    closedir($handle);
}
echo json_encode($files);
?>