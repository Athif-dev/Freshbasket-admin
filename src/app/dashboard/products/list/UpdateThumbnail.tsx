import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { imageUpload } from "@/app/lib/action";

const UpdateImages = ({ open, onClose, currentThumbnail }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentThumbnail);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  }, []);

  const onUpload = async () => {
    if (uploadedFile) {
      try {
        const imageUrl = await imageUpload([uploadedFile]);
        const newImage = imageUrl[0].uploads[0].url;
        onClose(newImage);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleDeleteImage = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="font-poppins"
    >
      <div className="flex items-center justify-between pt-4 px-[4%]">
        <h2 className="font-medium text-xl">Upload Thumbnail</h2>
        <button
          onClick={() => {
            setUploadedFile(null);
            setPreviewUrl(currentThumbnail);
            onClose();
          }}
        >
          <CloseIcon />
        </button>
      </div>
      <DialogContent>
        <hr />
        <h2 className="text-left font-medium mt-2">Thumbnail</h2>
        <p className="text-xs mb-3 text-gray-500">
          Used to represent your product during checkout, social sharing, and
          more.
        </p>
        <div className="flex flex-col items-center transition-all ease-in-out">
          <div
            {...getRootProps()}
            className="w-full h-20 my-3 border-2 border-dashed border-gray-400 hover:border-main-green rounded-md flex justify-center items-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>
              Drag & drop an image here, or{" "}
              <span className="text-main-green">click to select one</span>
            </p>
          </div>
          {previewUrl ? (
            <div className="flex justify-between items-center w-full px-[5%] my-3 bg-gray-50 rounded hover:bg-gray-100">
              <Image src={previewUrl} alt="Uploaded" width={60} height={60} />
              <button onClick={handleDeleteImage} className="text-red-500">
                <DeleteOutlineIcon />
              </button>
            </div>
          ) : null}
        </div>
      </DialogContent>
      <hr />
      <DialogActions className="py-5">
        <button
          onClick={() => {
            setUploadedFile(null);
            setPreviewUrl(currentThumbnail);
            onClose();
          }}
        >
          Cancel
        </button>
        <button
          className="py-1.5 px-3 bg-main-green text-sm text-white rounded-lg"
          onClick={onUpload}
        >
          Save & Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateImages;
