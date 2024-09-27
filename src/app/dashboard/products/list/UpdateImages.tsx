import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { imageUpload } from "@/app/lib/action";

interface UpdateImagesProps {
  open: boolean;
  onClose: (newImages?: { url: string }[]) => void;
  currentImages: { url: string }[];
}

const UpdateImages = ({ open, onClose, currentImages }: UpdateImagesProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [updatedImages, setUpdatedImages] =
    useState<{ url: string }[]>(currentImages);
  const [previewUrls, setPreviewUrls] =
    useState<{ url: string }[]>(currentImages);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      const newPreviews = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
      }));

      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  }, []);

  const onUpload = async () => {
    if (uploadedFiles.length > 0) {
      try {
        const imageUrls = await imageUpload(uploadedFiles);
        const newImages = imageUrls.flatMap((image) => {
          return image.uploads.map((upload) => ({
            url: upload.url,
          }));
        });

        const combinedImages = [...updatedImages, ...newImages];
        setUpdatedImages(combinedImages);
        onClose(combinedImages);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    } else {
      onClose(updatedImages);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const handleDeleteImage = (url: string) => {
    setPreviewUrls((prev) => prev.filter((image) => image.url !== url));
    setUpdatedImages((prev) => prev.filter((image) => image.url !== url));
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      maxWidth="sm"
      fullWidth
      className="font-poppins"
    >
      <div className="flex items-center justify-between pt-4 px-[4%]">
        <h2 className="font-medium text-xl">Upload Images</h2>
        <button
          onClick={() => {
            setUploadedFiles([]);
            setPreviewUrls(currentImages);
            setUpdatedImages(currentImages); // Reset updatedImages to currentImages
            onClose();
          }}
        >
          <CloseIcon />
        </button>
      </div>
      <DialogContent>
        <hr />
        <h2 className="text-left font-medium mt-2">Media</h2>
        <p className="text-xs mb-3 text-gray-500">
          Add images to your product.
        </p>
        <div className="flex flex-col items-center transition-all ease-in-out">
          <div
            {...getRootProps()}
            className="w-full h-20 my-3 border-2 border-dashed border-gray-400 hover:border-main-green rounded-md flex justify-center items-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>
              Drag & drop images here, or{" "}
              <span className="text-main-green">click to select them</span>
            </p>
          </div>

          {previewUrls && previewUrls.length > 0 ? (
            previewUrls.map((image, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full px-[5%] my-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={`Uploaded ${index}`}
                  width={60}
                  height={60}
                />
                <button
                  onClick={() => handleDeleteImage(image.url)}
                  className="text-red-500"
                >
                  <DeleteOutlineIcon />
                </button>
              </div>
            ))
          ) : (
            <p>No images uploaded</p>
          )}
        </div>
      </DialogContent>
      <hr />
      <DialogActions className="py-5">
        <button
          onClick={() => {
            setUploadedFiles([]);
            setPreviewUrls(currentImages);
            setUpdatedImages(currentImages); // Reset updatedImages to currentImages
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
