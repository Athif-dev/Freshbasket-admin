import React from "react";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";

function navbar() {
  return (
    <div>
      <div className="flex w-full min-h-12 mt-5 bg-[#FFFFFF] justify-between rounded shadow-dashboard-tile-shadow">
        <div className="flex items-center px-4 gap-3">
          <SearchIcon />
          <input
            className="h-full font-poppins focus:outline-none"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center text-[#2A4178] px-6 gap-4">
          <NotificationsIcon />
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default navbar;
