import { isFontFile, isImageFile, isVideoFile } from "@/utils";
import { FileIcon, FontIcon, VideoIcon } from "@/components/icons";
import Image from "@/components/image";

const FileTypeImage = ({ url }: { url?: string }) => {
  if (!url) {
    return <FileIcon />;
  }

  if (isImageFile(url)) {
    return <Image src={url} alt="Asset image" error={<FileIcon />} />;
  }

  if (isVideoFile(url)) {
    return <VideoIcon />;
  }

  if (isFontFile(url)) {
    return <FontIcon />;
  }

  return <FileIcon />;
};

export default FileTypeImage;
