import Medusa from "@medusajs/medusa-js";
import Cookies from "js-cookie";
import { cookies } from "next/headers";

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
});

// Login
function storeSession(user: [], token: string) {
  Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Expires in 7 days
  if (token) {
    Cookies.set("token", token, { expires: 7 }); // Expires in 7 days
  }
}

export async function UserLogin(formData: { email: string; password: string }) {
  try {
    // Create a session
    const loginResponse = await medusa.admin.auth.createSession(formData);
    const user = loginResponse.user;
    console.log("User:", user);

    const tokenResponse = await medusa.admin.auth.getToken(formData);
    console.log("Token:", tokenResponse.access_token);

    // Store user and token in cookies
    storeSession(user, tokenResponse.access_token);

    return { user, token: tokenResponse }; // Return both user and token if necessary
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error in login:", error.response.data.message);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}

export function UserLogout() {
  // Remove user and token from cookies
  Cookies.remove("user");
  Cookies.remove("token");
  console.log("User logged out");
}

/////////// Products
export async function addProducts(productsData: {
  title: string;
  description: string;
  thumbnail: string[];
  images: string[];
  variants: Array<{
    title: String;
    prices: Array<{
      amount: number;
      region_id: String;
    }>;
  }>;
  tags: Array<{ id: String; value: String }>;
}) {
  try {
    const { product } = await medusa.admin.products.create(productsData);

    console.log("add product worked, id - " + product.id);

    return product;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}

// Update Product
export async function updateProduct(
  id: string,
  productsData: {
    title: string;
    description: string;
    thumbnail: string[];
    images: string[];
    variants: Array<{
      title: String;
      prices: Array<{
        amount: number;
        region_id: String;
      }>;
    }>;
    tags: Array<{ id: String; value: String }>;
  }
) {
  try {
    console.log(productsData);

    const { product } = await medusa.admin.products.update(id, productsData);

    console.log("updated, id - " + product.id);

    return product;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}

//// Get
export async function getProducts() {
  try {
    const respone = await medusa.admin.products.list();
    return respone;
  } catch (error) {}
}

//// Delete
export async function deleteProduct(productId: string) {
  console.log(productId);

  try {
    await medusa.admin.products.delete(productId);
  } catch (error) {
    throw error;
  }
}

export async function getTags() {
  try {
    const response = await medusa.admin.productTags.list();
    return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}
/// Image Upload
export async function imageUpload(files: File[]) {
  try {
    const response = await Promise.all(
      files.map((file) => medusa.admin.uploads.create(file))
    );
    return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}

//////// Category
export async function addCategory(categoryData: {
  name: string;
  description: string;
  handle: string;
  parent_category_id: string;
}) {
  try {
    const { category } = await medusa.admin.productCategories.create(
      categoryData
    );

    console.log("Update category worked, id - " + category);

    return category;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}
//// Get
export async function getCategories() {
  try {
    const respone = await medusa.admin.productCategories.list();
    return respone;
  } catch (error) {
    throw error;
  }
}

//// update category
export async function updateCategory(
  id: string,
  categoryData: {
    name: string;
    description: string;
    handle: string;
    parent_category_id: string;
  }
) {
  try {
    const { category } = await medusa.admin.productCategories.update(
      id,
      categoryData
    );

    console.log("add category worked, id - " + category);

    return category;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error("Error creating product:", error.response.data.message);
    } else {
      console.error("Error creating product:", error.message);
    }
    throw error;
  }
}

//// Delete
export async function deleteCategory(productCategoryId: string) {
  console.log(productCategoryId);

  try {
    await medusa.admin.productCategories.delete(`:${productCategoryId}`);
  } catch (error) {
    throw error;
  }
}
