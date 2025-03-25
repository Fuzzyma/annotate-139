"use client"

import { format } from "date-fns"
import { MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Observation } from "@/lib/types"

interface ObservationDetailProps {
  observation: Observation
  onDelete: (id: string) => void
  onEdit: (observation: Observation) => void
}

export function ObservationDetail({ observation, onDelete, onEdit }: ObservationDetailProps) {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">{observation.species}</DialogTitle>
      </DialogHeader>

      <div className="rounded-md overflow-hidden bg-muted">
        {observation.photo ? (
          <img
            src={observation.photo || "/placeholder.svg"}
            alt={observation.species}
            className="w-full object-cover max-h-80"
          />
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground">No image available</div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{observation.location}</span>
        </div>

        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{format(new Date(observation.date), "PPP")}</span>
        </div>

        {observation.notes && (
          <div className="pt-2 border-t">
            <h4 className="font-medium mb-1">Notes</h4>
            <p className="text-sm">{observation.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(observation)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete this observation record.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(observation.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

