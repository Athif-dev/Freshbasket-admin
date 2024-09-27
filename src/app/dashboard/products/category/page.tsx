"use client";

import { addCategory, getCategories } from "@/app/lib/action";
import React, { useState, useEffect } from "react";
import CategoryList from "./CategoryList";
import { useDropzone } from "react-dropzone";

import { Alert, Snackbar } from "@mui/material";

function Category() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  type Category = {
    id: string;
    name: string;
    created_at: string;
    parent_category: { name: string };
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const APIcatogries = await getCategories();
        setCategories(APIcatogries.product_categories);
      } catch (error) {
        throw error;
      }
    };
    fetchCategories();
  }, [isFormVisible]);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Add category
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const categoryData = {
      name: categoryName,
      description: description,
      handle: categoryName,
      parent_category_id: parentCategory,
      is_active: true,
    };
    try {
      await addCategory(categoryData);
      setOpenSnackbar(true);
      toggleFormVisibility();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="relative h-auto bg-white shadow-dashboard-tile-shadow p-4">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Category added successfully!
        </Alert>
      </Snackbar>
      {/* Background Overlay */}
      {isFormVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFormVisibility}
        />
      )}

      <div className=" font-poppins">
        <div className="flex justify-between">
          <input
            className="border-[1px] border-gray-300 h-9 w-[20%] rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
            placeholder="search"
          />
          <button
            onClick={toggleFormVisibility}
            className="bg-main-green py-2 px-5 mr-2 rounded-sm text-white font-medium hover:bg-emerald-600 transition-all ease-in"
          >
            + Add Category
          </button>
        </div>
        {/* category list */}
        <CategoryList categories={categories} />
      </div>

      {/* Sliding Form */}
      <div
        className={`fixed top-0 right-0 h-max w-[26%] bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${
          isFormVisible
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Add Category</h2>

            <button
              onClick={toggleFormVisibility}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm mb-1 font-medium"
                htmlFor="categoryName"
              >
                Title<span className="text-red-700">*</span>
              </label>
              <input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
                placeholder="Fruit"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm mb-1 font-medium"
                htmlFor="description"
              >
                Description
              </label>
              <input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
                placeholder="Enter description..."
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm mb-1 font-medium"
                htmlFor="parentCategory"
              >
                Parent Category
              </label>
              <select
                id="parentCategory"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
              >
                <option value="">Select</option>
                {categories.map((category, index) => {
                  return (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 bg-main-green py-2 px-5 rounded-md text-white font-medium hover:bg-emerald-600 transition-all ease-in"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Category;
