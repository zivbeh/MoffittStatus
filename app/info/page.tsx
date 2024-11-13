"use client";

import {LibraryHours} from "@/components/library-hours"
import { useEffect, useState } from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { AiOutlineInstagram } from "react-icons/ai";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

export default function InfoPage() {
  
  return (
    <div className="container mx-auto px-4 mt-5">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <AcademicCapIcon className="h-10 w-10 mr-4 transition-transform duration-300 hover:scale-110 bg-gradient-to-r from-black to-white bg-clip-text" />
          <h1 className="text-3xl font-bold transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
            MoffittStatus
          </h1>
        </div>
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Library Capacity</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList> 
          </NavigationMenu>
        </div>
        <a
          href="https://www.instagram.com/moffittstatus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl text-purple-500 hover:text-pink-500 hover:scale-110 transition-transform duration-300 transition-colors"
        >
          <AiOutlineInstagram />
        </a>
      </div>

      {/* Thin Divider */}
      <div className="w-full h-[1px] bg-gray-300 mb-5"></div>
      <div className="mt-5">
        <LibraryHours/>
      </div>
    </div>

  );
}
