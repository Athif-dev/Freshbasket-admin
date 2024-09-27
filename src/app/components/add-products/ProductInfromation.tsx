"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Editor } from "@tiptap/core";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setName, setDescription } from "@/app/store/slices/createProductSlice";

function ProductInformation() {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
      return null;
    }

    return (
      <div className="flex space-x-4 py-1 mb-2 rounded">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("bold")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatBoldIcon className="object-contain w-6 h-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("underline")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatUnderlinedIcon className="object-contain w-6 h-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("italic")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatItalicIcon className="object-contain w-6 h-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("textAlign", "left")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatAlignLeftIcon className="object-contain w-6 h-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("textAlign", "center")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatAlignCenterIcon className="object-contain w-6 h-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`hover:bg-gray-100 p-0.5 ${
            editor.isActive("textAlign", "right")
              ? "text-main-green bg-green-100 hover:bg-green-100"
              : "text-gray-500"
          } rounded`}
        >
          <FormatAlignRightIcon className="object-contain w-6 h-6" />
        </button>
      </div>
    );
  };

  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: productDescription,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setProductDescription(content);

      if (content.trim() === "") {
        setDescriptionError("Product description is required.");
      } else {
        setDescriptionError(null);
      }

      dispatch(setDescription(content));
    },
  });

  useEffect(() => {
    if (descriptionEditor) {
      descriptionEditor.commands.setContent(productDescription);
    }
  }, [productDescription, descriptionEditor]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductName(value);

    if (value.trim() === "") {
      setNameError("Product name is required.");
    } else {
      setNameError(null);
    }

    dispatch(setName(value));
  };

  return (
    <div>
      <div className="bg-white shadow-dashboard-tile-shadow rounded">
        <div className="flex flex-col p-4">
          <h2 className="mb-5 text-base font-medium">General Information</h2>
          <div className="pb-5">
            <label htmlFor="productName" className="text-[0.9rem] font-medium">
              Product Name
            </label>
            <input
              id="productName"
              value={productName}
              onChange={handleNameChange}
              className={`border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in ${
                nameError ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="Carrot"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          <div className="pb-4">
            <label
              htmlFor="productDescription"
              className="text-[0.9rem] font-medium"
            >
              Product Description
            </label>
            <div className="mt-2">
              <EditorToolbar editor={descriptionEditor} />
            </div>
            <hr className="border-[1px] border-gray-200 mb-5" />
            <EditorContent
              editor={descriptionEditor}
              className={`border border-gray-300 rounded p-2 h-[170px] hover:border-gray-500 focus:border-none focus:outline-none transition-all ease-in overflow-x-auto flex flex-col scrollbar-thin ${
                descriptionError ? "border-red-500" : ""
              }`}
            />
            {descriptionError && (
              <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInformation;
