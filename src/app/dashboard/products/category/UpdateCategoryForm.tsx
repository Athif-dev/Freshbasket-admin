import { updateCategory } from "@/app/lib/action";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";

function UpdateCategoryForm({ currentCategory, allCategories, onClose }) {
  const [categoryName, setCategoryName] = useState(currentCategory.name);
  const [description, setDescription] = useState(currentCategory.description);
  const [parentCategory, setParentCategory] = useState(
    currentCategory.parent_category
  );
  const [loading, setLoading] = useState<boolean>(false);

  //   console.log(allCategories.map((cat) => cat.id))
  console.log(parentCategory);

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    const id = currentCategory.id;
    const categoryData = {
      name: categoryName,
      description: description,
      handle: categoryName,
      parent_category_id: parentCategory,
    };
    try {
      setLoading(true);
      await updateCategory(id, categoryData);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div>
      <form className="mt-4">
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
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-[1px] border-gray-300 h-16 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
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
            value={parentCategory?.id}
            onChange={(e) => setParentCategory(e.target.value)}
            className="border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
          >
            <option value={parentCategory}>{parentCategory?.name}</option>
            {allCategories.map((category, index) => {
              return (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-main-green text-white flex items-center justify-center min-w-20 min-py-2 rounded-md hover:bg-emerald-600 transition-all"
            onClick={updateCategoryHandler}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: "white",
                }}
                size={25}
                thickness={4}
              />
            ) : (
              "Save"
            )}
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateCategoryForm;
