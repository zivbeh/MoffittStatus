'use client'

import { useState } from "react";
import BusyReportDialog from "./busyReportDialog";

export function SubmitReport () {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

return <div className="flex items-center gap-6">
<div
  onClick={()=>setIsDialogOpen(true)}
  className="rounded-md py-2 px-4 bg-blue-400 text-sm font-medium text-muted-foreground transition-colors hover:bg-blue-400  text-white cursor-pointer"
>
  How busy is it?
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
}