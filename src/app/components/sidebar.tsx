"use client";

import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import SubMenu from "./SubMenu";
import { UserLogout } from "../lib/action";
import { useRouter } from "next/navigation";

const Sidebar: FC = () => {
  const router = useRouter();
  const handleLogout = () => {
    UserLogout();
    router.push("/login");  
  };
  return (
    <div className="stickey w-[17%] h-full overflow-hidden flex flex-col gap-10 bg-[#FFFFFF] font-poppins py-8 px-6 transition-all ease-in shadow-dashboard-tile-shadow ">
      <div className="py-2 flex flex-col justify-center items-center cursor-pointer">
        <Image src="/Assets/Logo.svg" alt="logo" width={40} height={40} />
        <p className="text-xl font-light text-main-green">
          <span className="font-medium">F</span>resh
          <span className="font-medium">B</span>asket
        </p>
      </div>
      <nav>
        <ul className="m-auto flex flex-col items-center text-left font-medium space-y-2 text-custom-black">
          <li
            className={`flex items-center gap-4 py-3 w-full rounded-lg cursor-pointer hover:bg-[#F8FAFF] transition-all ease-in `}
          >
            <DashboardIcon />
            <Link href="/dashboard/home" className="">
              Dashboard
            </Link>
          </li>

          <li
            className={`flex items-center gap-4 py-3 w-full rounded-lg cursor-pointer hover:bg-[#F8FAFF] transition-all ease-in `}
          >
            <ShoppingCartIcon />
            <Link href="/dashboard/orders" className="">
              Orders
            </Link>
          </li>
          {/* <NavDropdown /> */}

          <SubMenu label="Products" icon={<ShoppingBagIcon />}>
            <li className="py-2 w-full flex gap-1 items-center rounded-lg hover:bg-[#F8FAFF] cursor-pointer transition-all ease-in">
              <RadioButtonUncheckedIcon className="text-xs" />
              <Link href="/dashboard/products/list">List</Link>
            </li>
            <li className="py-2 w-full flex gap-1 items-center rounded-lg hover:bg-[#F8FAFF] cursor-pointer transition-all ease-in">
              <RadioButtonUncheckedIcon className="text-xs" />

              <Link href="/dashboard/products/add">Add</Link>
            </li>
            <li className="py-2 w-full flex gap-1 items-center rounded-lg hover:bg-[#F8FAFF] cursor-pointer transition-all ease-in">
              <RadioButtonUncheckedIcon className="text-xs" />

              <Link href="/dashboard/products/category">Category</Link>
            </li>
          </SubMenu>
        </ul>
      </nav>

      {/* Customer Support */}
      <div className="m-auto">
        <h2 className="text-black font-semibold pb-4">Customer Support</h2>
        <p className="text-gray-400 font-light text-sm">
          Ask you query , place requests or important issues. Our support team
          will contact 24/7 to you.
        </p>
        <li className="flex items-center w-[85%] text-emerald-500 font-medium text-sm gap-4 mt-4 py-3 px-2 rounded-lg bg-emerald-100 cursor-pointer hover:shadow-sidebar-shadow transition-all ease-in">
          <SupportAgentIcon />
          <Link href="/dashboard/products" className="">
            Connect Now
          </Link>
        </li>
      </div>

      {/* Logout */}
      <li
        onClick={handleLogout}
        className="flex items-center gap-4 mt-2 py-1 w-full text-red-500 rounded-lg hover:bg-[#F8FAFF] cursor-pointer transition-all ease-in"
      >
        <LogoutIcon />
        <Link href="/dashboard/products" className="">
          Logout
        </Link>
      </li>
    </div>
  );
};

export default Sidebar;
