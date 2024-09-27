"use client";
import { useDropzone } from "react-dropzone";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { imageUpload } from "@/app/lib/action";
import { useDispatch } from "react-redux";
import { setImages } from "@/app/store/slices/createProductSlice";

import { Alert, Badge, Snackbar, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB

const ProductImages: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Reset errors
      setError(null);

      // Validate files
      const invalidFiles = acceptedFiles.filter((file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        return fileSizeMB > MAX_FILE_SIZE_MB || !file.type.startsWith("image/");
      });

      if (invalidFiles.length > 0) {
        setError(
          "One or more files are invalid. Please upload images under 5MB."
        );
        return;
      }

      // Set the file objects and preview URLs
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    },
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const uploadHandler = async () => {
    if (files.length === 0) {
      setError("Please select images before uploading.");
      return;
    }

    try {
      console.log("Image upload");

      const imageUrl = await imageUpload(files);

      const allUrls = imageUrl.flatMap((response) =>
        response.uploads.map((upload) => upload.url)
      );

      if (allUrls.length > 0) {
        dispatch(setImages(allUrls)); // Dispatch array of URLs
        setOpenSnackbar(true); // Show the Snackbar
        setUploaded(true); // Set uploaded flag
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setError("An error occurred while uploading images.");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className="bg-white shadow-dashboard-tile-shadow rounded p-4 mt-4">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Images uploaded successfully!
        </Alert>
      </Snackbar>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <h2 className="mb-5 text-base font-medium">Product Images</h2>
      <div
        {...getRootProps({ className: "dropzone" })}
        className={`border-2 border-dashed p-4 rounded h-[200px] flex items-center justify-center cursor-pointer ${
          isDragActive ? "bg-gray-100" : "bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-gray-600">Drop the files here ...</p>
        ) : (
          <p className="text-center text-gray-600">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      {/* Display file previews */}
      <div className="mt-4 flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <Badge
            key={index}
            badgeContent={
              uploaded ? <CheckCircleIcon className="text-main-green" /> : null
            }
          >
            <div
              key={index}
              className="relative w-16 h-16 border rounded overflow-hidden flex items-center justify-center"
            >
              <Image
                src={preview}
                alt={`preview-${index}`}
                width={100}
                height={100}
                className="object-fill"
              />
              {uploaded ? null : (
                <IconButton
                  onClick={() => handleDelete(index)}
                  className="absolute -top-2.5 -right-2"
                  color="error"
                >
                  <CancelIcon className="text-gray-900" />
                </IconButton>
              )}
            </div>
          </Badge>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={uploadHandler}
          className="py-2 px-6 bg-main-green text-white font-medium rounded hover:bg-emerald-600 transition-all ease-in"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ProductImages;
