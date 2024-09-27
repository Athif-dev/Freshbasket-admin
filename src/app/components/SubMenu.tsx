"use client";
import React, { ReactNode } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface SubMenuProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}

const SubMenu: React.FC<SubMenuProps> = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="submenu w-full">
      <div
        className="flex items-center gap-4 py-3 w-full rounded-lg hover:bg-[#F8FAFF] cursor-pointer hover:shadow-md transition-all ease-in"
        onClick={toggleOpen}
      >
        {icon}
        <span className="flex-1">{label}</span>
        <span>
          {isOpen ? (
            <ExpandLessIcon className="text-gray-600 text-xl" />
          ) : (
            <ExpandMoreIcon className="text-gray-600 text-xl" />
          )}
        </span>
      </div>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <ul className="ml-8 space-y-2">{children}</ul>
      </Collapse>
    </div>
  );
};

export default SubMenu;
