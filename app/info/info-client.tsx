"use client";

import {LibraryHours} from "@/components/library-hours"
import NavBar from "@/components/basic/NavBar";
import NavBar from "@/components/basic/NavBar";

export default function InfoPageClient() {
  return (
    <div className="container mx-auto px-4 mt-5">
      <NavBar LibraryCapacity={true} LibraryHours={true} MLK={true}></NavBar>
        <LibraryHours/>
    </div>
  );
}
