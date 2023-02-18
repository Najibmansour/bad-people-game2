import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import LoginDiv from "./login";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-slate-200 border-gray-100 px-2 sm:px-4 py-4 rounded dark:bg-gray-900">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="/" className="flex items-center">
          <span className="self-center text-4xl pl-4 lg:text-xl font-semibold whitespace-nowrap text-primary">
            Bad People
          </span>
        </a>
        <div className="flex md:order-2">
          <button
            className="mx-5"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
          >
            {theme != "dark" ? (
              <HiOutlineSun size={25} />
            ) : (
              <HiOutlineMoon size={25} />
            )}
          </button>
          <LoginDiv />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
