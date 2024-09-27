import ProductAddHeader from "@/app/components/add-products/ProductAddHeader";
import ProductImages from "@/app/components/add-products/ProductImages";
import ProductInfromation from "@/app/components/add-products/ProductInfromation";
import ProductOrganize from "@/app/components/add-products/ProductOrganize";
import ProductPricing from "@/app/components/add-products/ProductPricing";
import ProductThumbnail from "@/app/components/add-products/ProductThumbnail";
import React from "react";

function AddProducts() {
  return (
    <div className="max-h-[100vh]">
      <div>
        <ProductAddHeader />
      </div>
      <div className="grid grid-cols-[60%_40%] gap-4 font-poppins">
        <div>
          <ProductInfromation />
          <ProductThumbnail />
          <ProductImages />
        </div>
        <div>
          <ProductOrganize />
          <ProductPricing />
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
