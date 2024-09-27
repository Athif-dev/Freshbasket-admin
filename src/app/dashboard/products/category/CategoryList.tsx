import React, { useState, useEffect } from "react";
import UpdateCategoryForm from "./UpdateCategoryForm";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
  DialogTitle,
  DialogContent,
  Dialog,
  IconButton,
} from "@mui/material";
import { deleteCategory, getCategories } from "@/app/lib/action";

type Category = {
  id: string;
  name: string;
  created_at: string;
  parent_category?: { name: string };
};

function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.product_categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [openDialog]);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    setDeleting(id);
    try {
      await deleteCategory(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setDeleting(null);
    }
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <div className="mt-6">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Category Deleted successfully!
        </Alert>
      </Snackbar>
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress size={30} style={{ color: "#3BB77E" }} />
        </div>
      ) : (
        <>
          <table className="min-w-full">
            <thead className="bg-gray-100 rounded-xl">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Parent Category
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                      {category.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                      {category.parent_category?.name || "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="flex gap-2 px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                      <button onClick={() => handleEditClick(category)}>
                        <EditNoteIcon className="text-yellow-500" />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)}>
                        {deleting === category.id ? (
                          <CircularProgress
                            size={20}
                            style={{ color: "red" }}
                          />
                        ) : (
                          <DeleteOutlineIcon className="text-red-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center py-4">
            <Pagination
              count={Math.ceil(categories.length / categoriesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </div>
        </>
      )}

      {/* ////// Update Category Form /////*/}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
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
          Edit Category
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
          {selectedCategory && (
            <UpdateCategoryForm
              currentCategory={selectedCategory}
              allCategories={categories}
              onClose={handleCloseDialog} // Pass onClose here
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoryList;
