"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import UpdateForm from "./UpdateForm";
import { deleteProduct, getProducts } from "@/app/lib/action";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import {
  Alert,
  CircularProgress,
  Snackbar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Product {
  id: string;
  title: string;
  thumbnail?: string;
  categories?: { name: string }[];
  created_at: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setSnackbarMessage("Failed to load products.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // const intervalId = setInterval(fetchProducts, 3000);
    // return () => clearInterval(intervalId);
  }, [openDialog]);

  console.log(products);
  

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setSnackbarMessage("Product deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setSnackbarMessage("Failed to delete product.");
      setOpenSnackbar(true);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white h-[87vh] p-2 px-6 font-poppins rounded-md shadow-dashboard-tile-shadow">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="flex justify-between py-4">
        <h2 className="font-medium text-xl text-custom-black">Products</h2>
        <button
          onClick={() => router.push("/dashboard/products/add")}
          className="bg-main-green py-2 px-5 mr-2 rounded-md text-white font-medium hover:scale-105 hover:bg-emerald-600 transition-all ease-in"
        >
          + Add products
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress size={30} style={{ color: "#3BB77E" }} />
        </div>
      ) : (
        <>
          <table className="min-w-full">
            <thead className="bg-main-green">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Brand
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border-b border-gray-200 text-[0.8rem] text-custom-black">
                    <div className="flex items-center gap-2 font-normal">
                      <Image
                        src={product.thumbnail || "/Assets/thumbnail.png"}
                        width={30}
                        height={30}
                        alt="thumbnail"
                      />
                      {product.title}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-[0.8rem] text-custom-black">
                    -
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-[0.8rem] text-custom-black">
                    {product.categories && product.categories.length > 0
                      ? product.categories
                          .map((category) => category.name)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-[0.8rem] text-custom-black">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-[0.8rem]">
                    <div className="flex gap-3">
                      <button onClick={() => handleEditClick(product)}>
                        <EditNoteIcon className="text-yellow-500" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)}>
                        <DeleteOutlineIcon className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center py-4">
            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </div>
        </>
      )}

      {/* ////// Update Form Dialog /////*/}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialogContent-root": {},
          "& .MuiDialog-paper": {
            backgroundColor: "#F1F1F1",
            overflowX: "hidden",
            overflowY: "auto",
            scrollbar: "scrollbar-thin",
          },
        }}
      >
        <DialogTitle className="font-medium font-poppins text-md relative">
          Edit Product
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <hr className="border border-gray-200 w-full" />

        <DialogContent>
          {selectedProduct && (
            <UpdateForm
              product={selectedProduct}
              onClose={handleCloseDialog} // Pass onClose here
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductList;
