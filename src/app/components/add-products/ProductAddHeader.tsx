"use client";
import { addProducts, getTags } from "@/app/lib/action";
import { RootState } from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearProductFields } from "@/app/store/slices/createProductSlice";
import { Snackbar, Alert, CircularProgress } from "@mui/material";

interface Tag {
  id: string;
  value: string;
}

function ProductAddHeader() {
  const name = useSelector((state: RootState) => state.createProduct.name);
  const description = useSelector(
    (state: RootState) => state.createProduct.description
  );
  const category = useSelector(
    (state: RootState) => state.createProduct.category
  );
  // const brand = useSelector((state: RootState) => state.createProduct.brand);
  const tags = useSelector((state: RootState) => state.createProduct.tags);
  const images = useSelector((state: RootState) => state.createProduct.images);
  const thumbnail = useSelector(
    (state: RootState) => state.createProduct.thumbnail
  );
  const variants = useSelector(
    (state: RootState) => state.createProduct.variants
  );

  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const APITags = await getTags();
        setExistingTags(APITags.product_tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Failed to fetch tags. Please try again.");
      }
    };
    fetchTags();
  }, []);

  const validateInputs = (): boolean => {
    if (
      !name ||
      !description ||
      !variants ||
      !category ||
      !thumbnail ||
      images.length === 0
    ) {
      setError(
        "Please fill out all required fields and add at least one image."
      );
      return false;
    }
    return true;
  };

  const resetFields = () => {
    dispatch(clearProductFields());
  };

  const addProductHandler = async () => {
    if (!validateInputs()) return;

    try {
      const productsData = {
        title: name,
        description: description,
        categories: [{ id: category }],
        variants: variants.map((variant) => {
          return {
            title: variant.name,
            prices: [
              {
                amount: parseFloat(variant.price),
                region_id: "reg_01J4XQEHZV04VK5KDPV6ZMDYNK",
              },
            ],
          };
        }),
        thumbnail: thumbnail,
        images: images,
        tags: tags.map((tag) => {
          const existingTag = existingTags.find(
            (existingTag) => existingTag.value === tag
          );
          return existingTag
            ? { id: existingTag.id, value: existingTag.value }
            : { value: tag };
        }),
        status: "published",
      };

      setLoading(true);
      const product = await addProducts(productsData);

      console.log(product);
      dispatch(clearProductFields()); // Reset the product fields after successful addition
      setOpenSnackbar(true); // Show success message
      setError(null);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <div className="flex justify-between font-poppins py-3">
        <h1 className="font-medium text-lg">Add New Product</h1>
        <button
          className="bg-main-green py-2 px-5 mr-2 rounded-md text-white font-medium hover:bg-emerald-600 transition-all ease-in active:scale-95 active:transition-none focus:outline-none relative overflow-hidden flex items-center justify-between"
          onClick={addProductHandler}
          disabled={loading} // Disable button while loading
        >
          <span className="relative z-10 text-md">Publish Product</span>
          {loading && (
            <CircularProgress size={20} className="text-white ml-3" />
          )}
        </button>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Product added successfully!
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
    </div>
  );
}

export default ProductAddHeader;
