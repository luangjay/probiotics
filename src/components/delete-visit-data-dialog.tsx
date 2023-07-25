import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VisitDataRow } from "@/types/visit-data";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

interface DeleteVisitDataDialogProps {
  visitData: VisitDataRow;
  trigger?: JSX.Element;
}

export function DeleteVisitDataDialog({
  visitData,
  trigger,
}: DeleteVisitDataDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault();
    setDeleting(true);
    const response = await fetch(`/api/visit-datas/${visitData.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setOpen(false);
      router.refresh();
    }
    setDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? <Button variant="outline">Delete visit data</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete visit data?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={(...args) => void handleDelete(...args)}
          >
            {deleting ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="mr-2 h-4 w-4" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
