"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/store"; // Import types from the store
import { setPropertyImages } from "../../../../store/slices/propertySlice";
import DeleteIcon from "@mui/icons-material/Delete";

interface FilePreview {
  name: string;
  preview: string;
}
function MediaUpload({ files, setFiles }) {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedImage, setSelectedImage] = useState<FilePreview | null>(null); // State for the selected image
  const [open, setOpen] = useState(false); // Modal open state

  const handleDelete = (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the dialog from opening
    setFiles((prevFiles: FilePreview[]) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleImageClick = (file: FilePreview, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedImage(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Map each accepted file to FilePreview format for preview and state
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      }));

      // Filter out duplicates based on file name
      const uniqueFiles = newFiles.filter(
        (newFile) => !files.some((file: FilePreview) => file.name === newFile.name)
      );

      if (uniqueFiles.length > 0) {
        // Update the files state with the new unique files
        setFiles((prevFiles: FilePreview[]) => [...prevFiles, ...uniqueFiles]);

        // Dispatch all file names (existing + new) to the Redux store
        const allFileNames = [...files.map((f: FilePreview) => f.name), ...uniqueFiles.map((file) => file.name)];
        dispatch(setPropertyImages(allFileNames));
      }
    },
    [files, setFiles, dispatch]
  );

  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
    };
    const dropHandler = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files) {
        onDrop(Array.from(e.dataTransfer.files));
      }
    };

    document.body.addEventListener("dragover", dragOverHandler);
    document.body.addEventListener("drop", dropHandler);

    return () => {
      document.body.removeEventListener("dragover", dragOverHandler);
      document.body.removeEventListener("drop", dropHandler);
    };
  }, [onDrop]);

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #cccccc",
          padding: 4,
          textAlign: "center",
          cursor: "pointer",
        }}
        mt={4}
      >
        <input {...getInputProps()} />
        <Typography variant="h6" gutterBottom>
          Drag & drop your media here, or click to select from computer
        </Typography>
        <Button variant="contained" component="span" onClick={openFileDialog}>
          Select from computer
        </Button>

        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Preview:</Typography>
            <Box display="flex" flexWrap="wrap">
              {files.map((file: FilePreview) => (
                <Box
                  key={file.name}
                  width={200}
                  height={200}
                  m={1}
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                  onClick={(e) => handleImageClick(file, e)}
                >
                  <img
                    src={`/uploads/${file.name}`}
                    alt={file.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    onClick={(e) => handleDelete(file.name, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage.preview}
              alt={selectedImage.name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MediaUpload;