"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { setVariants as setVariantsRedux } from "@/app/store/slices/createProductSlice"; 

// Define the type for a variant
interface Variant {
  name: string;
  price: string;
}

function ProductPricing() {
  const dispatch = useDispatch();
  const [priceError, setPriceError] = useState<string | null>(null);

  // Initialize with one variant
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", price: "" },
  ]);

  // Handle input changes for variant name and price
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const updatedVariants = variants.map((variant, idx) => {
      if (idx === index) {
        return { ...variant, [field]: value };
      }
      return variant;
    });
    setVariants(updatedVariants);

    // Dispatch updated variants to Redux store
    dispatch(setVariantsRedux(updatedVariants));
  };

  // Add new variant
  const addVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  // Remove a variant
  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, idx) => idx !== index);
    setVariants(updatedVariants);

    // Dispatch updated variants to Redux store
    dispatch(setVariantsRedux(updatedVariants));
  };

  return (
    <div className="bg-white shadow-dashboard-tile-shadow rounded p-4 mt-3">
      <div className="flex flex-col">
        <h2 className="mb-5 text-base font-medium">Variants & Pricing</h2>
      </div>
      {variants.map((variant, index) => (
        <div key={index} className="flex items-end gap-4 w-full pb-5">
          <div>
            <label
              htmlFor={`name-${index}`}
              className="text-[0.9rem] font-medium"
            >
              Variant Name
            </label>
            <input
              id={`name-${index}`}
              className={`border-[1px] border-gray-300 h-9 w-full rounded-sm mt-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in ${
                priceError ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="1 kg"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
            />
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor={`price-${index}`}
              className="text-[0.9rem] font-medium"
            >
              Price
            </label>
            <input
              id={`price-${index}`}
              className={`border-[1px] border-gray-300 h-9 w-full rounded-sm mt-1 text-sm pl-2 hover:border-gray-500 focus:outline-none transition-all ease-in ${
                priceError ? "border-red-500" : ""
              }`}
              type="number"
              placeholder="₹"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
            />
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>
          {/* Remove Variant Button */}
          <div>
            <button
              type="button"
              className="h-9 px-1.5 bg-red-200 text-red-500 text-sm rounded mr-4"
              onClick={() => removeVariant(index)}
            >
              <CloseOutlinedIcon />
            </button>
          </div>
        </div>
      ))}
      <button
        className="px-6 py-1 bg-emerald-100 text-main-green text-sm rounded"
        onClick={addVariant}
      >
        <AddOutlinedIcon />
      </button>
    </div>
  );
}

export default ProductPricing;
