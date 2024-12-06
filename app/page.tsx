import { Metadata } from "next";
import HomePageClient from './home-client';

export const metadata: Metadata = {
  title: 'MoffitStatus - Find Library Seats at UC Berkeley',
  description: 'Real-time seat availability tracker for UC Berkeley Libraries. Find study spaces instantly at Moffitt, Doe, and other campus libraries.',
  openGraph: {
    title: 'MoffittStatus - Find Library Seats at UC Berkeley',
    description: 'Real-time seat availability for UC Berkeley\'s Moffitt Library',
  },
};

export default function Page() {
  return <HomePageClient />
}
