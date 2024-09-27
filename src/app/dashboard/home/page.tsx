import React from "react";
import Image from "next/image";

import welcomeAvatar from "@/app/Assets/welcome-avatar.png";
import RecentOrders from "@/app/components/RecentOrders";

function Home() {
  return (
    <>
      <div className="grid grid-cols-3 mt-5">
        <div className=" flex justify-between w-[350px] h-[160px] bg-[#FFFFFF] rounded-lg shadow-dashboard-tile-shadow cursor-pointer transition-transform transform hover:scale-95 ">
          <h2 className="font-poppins text-lg font-semibold pl-5 pt-6 text-nowrap">
            Welcome Eddy!
          </h2>
          <Image
            src={welcomeAvatar}
            className=" mr-1 "
            alt="Description"
            width={125}
            height={50}
          />
        </div>

        <div className="flex justify-between w-[350px] h-[160px] bg-gradient-to-br from-[#2bed92] to-main-green rounded-lg shadow-dashboard-tile-shadow cursor-pointer transition-transform transform hover:scale-95">
          <h2 className="font-poppins text-white text-lg font-semibold pl-5 pt-6 text-nowrap">
            Pending Orders
          </h2>
          <h2 className="font-poppins text-white text-6xl font-semibold pr-14 pt-20 text-nowrap">
            09
          </h2>
        </div>

        <div className=" flex justify-between w-[350px] h-[160px] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-dashboard-tile-shadow cursor-pointer transition-transform transform hover:scale-95 ">
          <h2 className="font-poppins text-white text-lg font-semibold pl-5 pt-6 text-nowrap">
            New Orders
          </h2>
          <h2 className="font-poppins text-white text-6xl font-semibold pr-14 pt-20 text-nowrap">
            35
          </h2>
        </div>
      </div>
      <RecentOrders />
    </>
  );
}

export default Home;
