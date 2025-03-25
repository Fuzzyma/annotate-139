"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface ObservationTableProps {
  observations: Observation[];
  onDelete: (id: string) => void;
  onView: (observation: Observation) => void;
  onEdit: (observation: Observation) => void;
}

type SortField = "species" | "location" | "date" | "notes";
type SortDirection = "asc" | "desc";

export function ObservationTable({
  observations,
  onDelete,
  onView,
  onEdit,
}: ObservationTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  if (observations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No observations found.</p>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const sortedObservations = [...observations].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "species") {
      return sortDirection === "asc"
        ? a.species.localeCompare(b.species)
        : b.species.localeCompare(a.species);
    } else if (sortField === "location") {
      return sortDirection === "asc"
        ? a.location.localeCompare(b.location)
        : b.location.localeCompare(a.location);
    } else if (sortField === "notes") {
      return sortDirection === "asc"
        ? a.notes.localeCompare(b.notes)
        : b.notes.localeCompare(a.notes);
    }
    return 0;
  });

  return (
    <div className="border rounded-md min-h-0 grow">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("species")}
            >
              <div className="flex items-center">
                Species
                {getSortIcon("species")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("location")}
            >
              <div className="flex items-center">
                Location
                {getSortIcon("location")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date
                {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("notes")}
            >
              <div className="flex items-center">
                Notes
                {getSortIcon("notes")}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedObservations.map((observation) => (
            <TableRow
              key={observation.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onView(observation)}
            >
              <TableCell className="font-medium">
                {observation.species}
              </TableCell>
              <TableCell>{observation.location}</TableCell>
              <TableCell>{format(new Date(observation.date), "PP")}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {observation.notes}
              </TableCell>
              <TableCell className="text-right">
                <div
                  className="flex justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
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
                        size="icon"
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
                        <AlertDialogAction
                          onClick={() => onDelete(observation.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
