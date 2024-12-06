import { Metadata } from "next";
import InfoPageClient from './info-client';

export const metadata: Metadata = {
  title: 'MoffitStatus - Library Hours | UC Berkeley Libraries',
  description: 'Current operating hours for UC Berkeley Libraries. Check when Moffitt Library and other campus libraries are open.',
  openGraph: {
    title: 'MoffittStatus - Library Hours | UC Berkeley Libraries',
    description: 'Current operating hours for UC Berkeley Libraries',
  },
};

export default function Page() {
  return <InfoPageClient />
}
