import { Metadata } from "next";
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Library Hours | UC Berkeley Libraries',
  description: 'Current operating hours for UC Berkeley Libraries. Check when Moffitt Library and other campus libraries are open.',
  openGraph: {
    title: 'MoffittStatus - Library Hours',
    description: 'Current operating hours for UC Berkeley Libraries',
  },
};

const InfoPageClient = dynamic(() => import('@/app/info/info-client'), { ssr: false })

export default function Page() {
  return <InfoPageClient />
}
