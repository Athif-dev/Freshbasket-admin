import React from "react";
import Image from "next/image";

import loadingSpinner from "@/app/Assets/undefined - Imgur.gif";

function Loading() {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <Image src={loadingSpinner} alt="loading" width={40} height={40} />
    </div>
  );
}

export default Loading;
