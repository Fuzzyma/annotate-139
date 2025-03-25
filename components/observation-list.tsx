"use client";

import { format } from "date-fns";
import { MapPin, Calendar, Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { Observation } from "@/lib/types";

interface ObservationListProps {
  observations: Observation[];
  onDelete: (id: string) => void;
  onView: (observation: Observation) => void;
  onEdit: (observation: Observation) => void;
}

export function ObservationList({
  observations,
  onDelete,
  onView,
  onEdit,
}: ObservationListProps) {
  if (observations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No observations found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grow auto-rows-min min-h-[400px]">
      {observations.map((observation) => (
        <Card
          key={observation.id}
          className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow shrink-0"
          onClick={() => onView(observation)}
        >
          <div className="aspect-video relative bg-muted">
            {observation.photo ? (
              <img
                src={observation.photo || "/placeholder.svg"}
                alt={observation.species}
                className="w-full h-full object-cover aspect-square"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle>{observation.species}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{observation.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(observation.date), "PPP")}</span>
              </div>
              {observation.notes && (
                <div className="pt-2">
                  <p className="text-sm line-clamp-2">{observation.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-end">
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(observation);
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this observation record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(observation.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
