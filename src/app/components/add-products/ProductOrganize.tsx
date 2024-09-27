"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory, setTags } from "@/app/store/slices/createProductSlice";
import { getCategories, getTags } from "@/app/lib/action";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  value: string;
}

function ProductOrganize() {
  const dispatch = useDispatch();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [category, setCategoryValue] = useState("");

  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [tags, setTagsState] = useState<string[]>([]);
  
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and tags
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const APIcategories = await getCategories();
        setCategoryList(APIcategories.product_categories);
      } catch (error) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const APITags = await getTags();
        setExistingTags(APITags.product_tags);
      } catch (error) {
        setError("Failed to fetch tags");
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategoryValue(selectedCategory);
    dispatch(setCategory(selectedCategory));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Filter existing tags based on the input value
    if (value) {
      const filtered = existingTags.filter((tag) =>
        tag.value.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const trimmedInput = input.trim();
      const existingTag = existingTags.find(
        (tag) => tag.value.toLowerCase() === trimmedInput.toLowerCase()
      );

      const newTagValue = existingTag ? existingTag.value : trimmedInput;

      if (!tags.includes(newTagValue)) {
        const updatedTags = [...tags, newTagValue];
        setTagsState(updatedTags);
        setInput("");

        setFilteredTags([]);

        dispatch(
          setTags(updatedTags.filter((tag) => tag !== null) as string[])
        );
      }
    }
  };

  const handleSelectSuggestion = (tag: Tag) => {
    const tagValue = tag.value;

    if (!tags.includes(tagValue)) {
      const updatedTags = [...tags, tagValue];
      setTagsState(updatedTags);
      setInput("");

      setFilteredTags([]);

      dispatch(setTags(updatedTags.filter((tag) => tag !== null) as string[]));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTagsState(updatedTags);

    dispatch(setTags(updatedTags));
  };

  return (
    <div className="bg-white shadow-dashboard-tile-shadow rounded ">
      <div className="flex flex-col py-4 px-4">
        <h2 className="mb-5 text-base font-medium">Organize</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="pb-5">
              <label htmlFor="category" className="text-[0.9rem] font-medium">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="border-[1px] border-gray-300 h-9 w-[95%] rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
              >
                <option value="">Select a category</option>
                {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-5 relative">
              <label htmlFor="tags" className="text-[0.9rem] font-medium">
                Tags
              </label>
              <input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleAddTag}
                placeholder="Press Enter to add tags..."
                className="border-[1px] border-gray-300 h-9 w-full rounded-sm my-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in"
              />

              {/* Suggestion Dropdown */}
              {filteredTags.length > 0 && (
                <>
                  <p className="text-[0.8rem] text-gray-500 py-1">
                    Suggestions:
                  </p>
                  <div className="w-max text-main-green bg-white border border-gray-300 mt-1 rounded-sm">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => handleSelectSuggestion(tag)}
                        className="cursor-pointer px-2 py-1 test-sm hover:bg-gray-100"
                      >
                        {tag.value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-main-green px-2 py-1 rounded flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-700 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductOrganize;
