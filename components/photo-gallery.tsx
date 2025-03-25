"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ObservationDetail } from "./observation-detail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Observation } from "@/lib/types";

interface PhotoGalleryProps {
  observations: Observation[];
  onDelete: (id: string) => void;
  onEdit: (observation: Observation) => void;
}

export function PhotoGallery({
  observations,
  onDelete,
  onEdit,
}: PhotoGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedObservation, setSelectedObservation] =
    useState<Observation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get only observations with photos
  const observationsWithPhotos = observations.filter((obs) => obs.photo);

  // Get unique species for filter dropdown
  const uniqueSpecies = [
    ...new Set(observationsWithPhotos.map((obs) => obs.species)),
  ];

  // Filter observations based on search and species filter
  const filteredObservations = observationsWithPhotos.filter((obs) => {
    const matchesSearch =
      searchQuery === "" ||
      obs.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecies =
      selectedSpecies === "all" || obs.species === selectedSpecies;

    return matchesSearch && matchesSpecies;
  });

  const openDetailModal = (observation: Observation) => {
    setSelectedObservation(observation);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 min-h-0 grow flex flex-col overflow-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search photos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              {uniqueSpecies.map((species) => (
                <SelectItem key={species} value={species}>
                  {species}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredObservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No photos found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grow auto-rows-min min-h-[400px]">
          {filteredObservations.map((observation) => (
            <div
              key={observation.id}
              className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
              onClick={() => openDetailModal(observation)}
            >
              <img
                src={observation.photo || "/placeholder.svg"}
                alt={observation.species}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <h3 className="text-white font-medium truncate">
                  {observation.species}
                </h3>
                <p className="text-white/80 text-sm">
                  {format(new Date(observation.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedObservation && (
            <ObservationDetail
              observation={selectedObservation}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
