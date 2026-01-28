'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust this path if needed
import BusyReportDialog from '../components/busyReportDialog';
import { useState } from 'react';

export function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        
        <Link href="/" className="flex items-center gap-2.5">
          {/* <div className="h-8 w-8 bg-gray-300" /> */}
          
          <span className="text-lg font-bold text-foreground">
            MoffittStatus
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div
            onClick={()=>setIsDialogOpen(true)}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-400 cursor-pointer"
          >
            Submit Rating
          </div>

            <BusyReportDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              setOpen={setIsDialogOpen}
            />
          
          {/* <Link
            href="/hours"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-400"
          >
            Hours
          </Link> */}

          {/* <Button asChild size="sm" className='bg-blue-400 hover:bg-blue-600'>
            <Link href="/login">Log in</Link>
          </Button> */}
        </div>

      </div>
    </nav>
  );
}