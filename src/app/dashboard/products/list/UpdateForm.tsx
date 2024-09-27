import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories, getTags, updateProduct } from "@/app/lib/action";
import UpdateThumbnail from "./UpdateThumbnail";
import UpdateImages from "./UpdateImages";
import { CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  value: string;
}

interface ProductProps {
  product: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    images: { url: string }[];
    categories: Category[];
    tags: Tag[];
    variants: {
      title: string;
      prices: { amount: string }[];
    }[];
  };
  onClose: () => void;
}

function UpdateForm({ product, onClose }: ProductProps) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [thumbnail, setThumbnail] = useState(product.thumbnail);
  const [media, setMedia] = useState(product.images);

  const [updatedThumbnail, setUpdatedThumbnail] = useState("");
  const [newMedia, setNewMedia] = useState(product.images);

  const [category, setCategory] = useState(product.categories[0].id);
  const [tags, setTags] = useState<string[]>(
    product.tags.map((tag) => tag.value)
  );
  const [variants, setVariants] = useState(product.variants);

  const [editImages, setEditImages] = useState(false);
  const [editThumbnail, setEditThumbnail] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [input, setInput] = useState<string>("");

  // Fetch categories and tags
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const APIcategories = await getCategories();
        setCategoryList(APIcategories.product_categories);
      } catch (error) {
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
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // Variants
  const handleNameChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVariants = [...variants];
    newVariants[index].title = e.target.value;
    setVariants(newVariants);
  };

  const handlePriceChange = (
    variantIndex: number,
    priceIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVariants = [...variants];
    newVariants[variantIndex].prices[priceIndex].amount = e.target.value;
    setVariants(newVariants);
  };

  const handleDeleteVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  // Tags handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

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
        setTags((prevTags) => [...prevTags, newTagValue]);
        setInput("");
        setFilteredTags([]);
      }
    }
  };

  const handleSelectSuggestion = (tag: Tag) => {
    if (!tags.includes(tag.value)) {
      setTags((prevTags) => [...prevTags, tag.value]);
      setInput("");
      setFilteredTags([]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  // Update product handler
  const updateProductHandler = async () => {
    try {
      setLoading(true);
      const id = product.id;
      const productsData = {
        title,
        description,
        categories: [{ id: category }],
        variants: variants.map((variant) => {
          return {
            title: variant.title,
            prices: [
              {
                amount: parseFloat(variant.prices[0].amount),
                region_id: "reg_01J4XQEHZV04VK5KDPV6ZMDYNK",
              },
            ],
          };
        }),
        thumbnail,
        images: media.map((image) => image.url),
        tags: tags.map((tag) => {
          const existingTag = existingTags.find(
            (existingTag) => existingTag.value === tag
          );
          return existingTag
            ? { id: existingTag.id, value: existingTag.value }
            : { value: tag };
        }),
      };
      console.log(productsData);
      
      await updateProduct(id, productsData);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="h-max z-50 scrollbar-thin font-poppins">
      <div
        className="my-2 grid gap-4"
        style={{ gridTemplateColumns: "55% 45%" }}
      >
        <div>
          {/* title */}
          <div className="pb-5 flex flex-col">
            <label
              htmlFor="productName"
              className="text-[0.9rem] font-medium text-gray-600"
            >
              Product Name
            </label>
            <input
              id="productName"
              value={title}
              onChange={handleTitleChange}
              className="border-[1px] border-gray-300 w-full bg-gray-50 h-9 rounded-md my-1 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
              type="text"
              placeholder="Carrot"
            />
            <p className="text-xs text-gray-500 font-light leading-5">
              Give your product a short and clear title. <br /> 50-60 characters
              is the recommended length for search engines.
            </p>
          </div>

          {/* description */}
          <div className="pb-5 flex flex-col">
            <label
              htmlFor="productDescription"
              className="text-[0.9rem] font-medium text-gray-600"
            >
              Product Description
            </label>
            <textarea
              id="productDescription"
              value={description}
              onChange={handleDescriptionChange}
              className="border-[1px] border-gray-300 w-full bg-gray-50 h-36 rounded-md my-1 text-sm pl-2 pt-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
              placeholder="Description"
            />
            <p className="text-xs text-gray-500 font-light leading-5">
              Give your product a short and clear description. <br /> 120-160
              characters is the recommended length for search engines.
            </p>
          </div>
        </div>

        <div>
          {/* Thumbnail */}
          <div className="bg-white p-2 rounded-md">
            <div className="flex justify-between">
              <h2 className="font-medium text-lg text-gray-600">Thumbnail</h2>
              <button
                className="border border-gray-300 px-2 py-1 text-xs text-gray-600 font-medium rounded-md bg-gray-50"
                onClick={() => setEditThumbnail(true)}
              >
                Edit
              </button>
            </div>
            <Image
              src={thumbnail}
              alt="thumbnail"
              width={120}
              height={120}
              className="mt-4"
            />
          </div>
          <UpdateThumbnail
            open={editThumbnail}
            onClose={() => setEditThumbnail(false)}
            currentThumbnail={thumbnail}
            onUpdate={(newThumbnail) => {
              setThumbnail(newThumbnail);
              setEditThumbnail(false);
            }}
          />

          {/* Media */}
          <div className="bg-white p-2 rounded-md mt-4">
            <div className="flex justify-between">
              <h2 className="font-medium text-lg text-gray-600">Images</h2>
              <button
                className="border border-gray-300 px-2 py-1 text-xs text-gray-600 font-medium rounded-md bg-gray-50"
                onClick={() => setEditImages(true)}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-flow-col gap-2 mt-4">
              {media?.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={`image-${index}`}
                  width={90}
                  height={90}
                  className="rounded-md"
                />
              ))}
            </div>
          </div>
          <UpdateImages
            open={editImages}
            onClose={(updatedImages) => {
              setMedia(updatedImages);
              setEditImages(false);
            }}
            currentImages={media}
          />
        </div>
      </div>

      <div className="my-4 flex gap-5">
        {/* Category */}
        <div className="w-full flex flex-col">
          <label
            htmlFor="productCategory"
            className="text-[0.9rem] font-medium text-gray-600"
          >
            Category
          </label>
          <select
            id="productCategory"
            value={category}
            onChange={handleCategoryChange}
            className="border-[1px] border-gray-300 w-full bg-gray-50 h-9 rounded-md my-1 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
          >
            {categoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="w-full flex flex-col">
          <label
            htmlFor="tags"
            className="text-[0.9rem] font-medium text-gray-600"
          >
            Product Tags
          </label>
          <div className="flex items-center border-[1px] border-gray-300 w-full bg-gray-50 h-10 rounded-md my-1 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in">
            {tags.map((tag) => (
              <div className="flex bg-gray-100 text-main-green px-2 h-8 rounded items-center border w-max mr-2">
                <span key={tag} className="">
                  {tag}
                </span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-xs text-red-500"
                >
                  x
                </button>
              </div>
            ))}
            <input
              id="tags"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleAddTag}
              className="w-full bg-gray-50 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
              type="text"
              placeholder="Enter tags..."
            />
          </div>

          {/* Suggestion */}
          {filteredTags.length > 0 && (
            <div className="">
              <p className="text-sm p-2">Suggetions :</p>

              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleSelectSuggestion(tag)}
                  className="p-2 text-main-green text-sm cursor-pointer w-max bg-white border border-gray-200 rounded-md my-1 hover:bg-emerald-100 hover:text-black "
                >
                  {tag.value}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-5">
        <p>Variants</p>
        {variants.map((variant, variantIndex) => (
          <div className="flex gap-5 items-center" key={variantIndex}>
            <div>
              <label
                htmlFor={`variantName-${variantIndex}`}
                className="text-[0.8rem] font-medium text-gray-600"
              >
                Name
              </label>
              <input
                id={`variantName-${variantIndex}`}
                value={variant.title}
                onChange={(e) => handleNameChange(variantIndex, e)}
                className="border-[1px] border-gray-300 w-full bg-gray-50 h-9 rounded-md my-1 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
                type="text"
                placeholder="Variant Name"
              />
            </div>

            {variant.prices.map((price, priceIndex) => (
              <div key={priceIndex}>
                <label
                  htmlFor={`variantPrice-${variantIndex}-${priceIndex}`}
                  className="text-[0.8rem] font-medium text-gray-600"
                >
                  Price
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id={`variantPrice-${variantIndex}-${priceIndex}`}
                    value={price.amount}
                    onChange={(e) =>
                      handlePriceChange(variantIndex, priceIndex, e)
                    }
                    className="border-[1px] border-gray-300 w-full bg-gray-50 h-9 rounded-md my-1 text-sm pl-2 hover:border-gray-400 focus:outline-none transition-all ease-in"
                    type="number"
                    placeholder="Price"
                  />
                  <button onClick={() => handleDeleteVariant(variantIndex)}>
                    <DeleteOutlineIcon className="text-red-600 hover:text-red-700 text-[1.6rem] cursor-pointer" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="bg-main-green text-white flex items-center justify-center min-w-20 min-py-2 rounded-md hover:bg-emerald-600 transition-all"
          onClick={updateProductHandler}
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
    </div>
  );
}

export default UpdateForm;
