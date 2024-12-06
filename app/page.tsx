import { Metadata } from "next";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { AiOutlineInstagram } from "react-icons/ai";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Find Library Seats at UC Berkeley',
  description: 'Real-time seat availability tracker for UC Berkeley Libraries. Find study spaces instantly at Moffitt, Doe, and other campus libraries.',
  openGraph: {
    title: 'MoffittStatus - Find Library Seats at UC Berkeley',
    description: 'Real-time seat availability for UC Berkeley\'s Moffitt Library',
  },
};

import dynamic from 'next/dynamic'

const HomePageClient = dynamic(() => import('./home-client'), { ssr: false })

export default function Page() {
  return <HomePageClient />
}
