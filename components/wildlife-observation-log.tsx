"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateSampleData } from "@/lib/sample-data";
import type { Observation } from "@/lib/types";
import { Grid, Plus, Search, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImportExportActions } from "./import-export-actions";
import { ObservationChart } from "./observation-chart";
import { ObservationDetail } from "./observation-detail";
import { ObservationForm } from "./observation-form";
import { ObservationList } from "./observation-list";
import { ObservationTable } from "./observation-table";
import { PhotoGallery } from "./photo-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function WildlifeObservationLog() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedObservation, setSelectedObservation] =
    useState<Observation | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletedObservation, setDeletedObservation] =
    useState<Observation | null>(null);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedData = localStorage.getItem("wildlifeObservations");
    if (storedData) {
      setObservations(JSON.parse(storedData));
    } else {
      const sampleData = generateSampleData();
      setObservations(sampleData);
      localStorage.setItem("wildlifeObservations", JSON.stringify(sampleData));
    }
  }, []);

  // Helper function to sort observations by date (newest first)
  const sortObservationsByDate = (obs: Observation[]) => {
    return [...obs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const addObservation = (observation: Observation) => {
    const updatedObservations = sortObservationsByDate([
      ...observations,
      observation,
    ]);
    setObservations(updatedObservations);
    localStorage.setItem(
      "wildlifeObservations",
      JSON.stringify(updatedObservations)
    );
    setIsAddModalOpen(false);
    toast.success("Observation added", {
      description: `${observation.species} sighting has been recorded.`,
    });
  };

  const updateObservation = (updatedObservation: Observation) => {
    const updatedObservations = sortObservationsByDate(
      observations.map((obs) =>
        obs.id === updatedObservation.id ? updatedObservation : obs
      )
    );
    setObservations(updatedObservations);
    localStorage.setItem(
      "wildlifeObservations",
      JSON.stringify(updatedObservations)
    );

    // Close both modals and reset state
    setIsAddModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedObservation(null);
    setIsEditMode(false);

    toast.success("Observation updated", {
      description: `${updatedObservation.species} sighting has been updated.`,
    });
  };

  const deleteObservation = (id: string) => {
    const observationToDelete = observations.find((obs) => obs.id === id);
    if (!observationToDelete) return;

    setDeletedObservation(observationToDelete);

    const updatedObservations = observations.filter((obs) => obs.id !== id);
    setObservations(updatedObservations);
    localStorage.setItem(
      "wildlifeObservations",
      JSON.stringify(updatedObservations)
    );

    if (selectedObservation?.id === id) {
      setIsDetailModalOpen(false);
      setSelectedObservation(null);
    }

    toast.error("Observation deleted", {
      description: `${observationToDelete.species} sighting has been removed.`,
      action: {
        label: "Undo",
        onClick: () => recoverObservation(),
      },
    });
  };

  const recoverObservation = () => {
    if (!deletedObservation) return;

    // Add the deleted observation back and sort by date
    const updatedObservations = sortObservationsByDate([
      ...observations,
      deletedObservation,
    ]);
    setObservations(updatedObservations);
    localStorage.setItem(
      "wildlifeObservations",
      JSON.stringify(updatedObservations)
    );

    toast.success("Observation recovered", {
      description: `${deletedObservation.species} sighting has been restored.`,
    });

    setDeletedObservation(null);
  };

  const openDetailModal = (observation: Observation) => {
    setSelectedObservation(observation);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
  };

  const startEditObservation = (observation: Observation) => {
    setSelectedObservation(observation);
    setIsEditMode(true);
    setIsDetailModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleImport = (importedObservations: Observation[]) => {
    // Merge imported observations with existing ones
    const mergedObservations = sortObservationsByDate([
      ...observations,
      ...importedObservations,
    ]);
    setObservations(mergedObservations);
    localStorage.setItem(
      "wildlifeObservations",
      JSON.stringify(mergedObservations)
    );
  };

  const uniqueSpecies = [...new Set(observations.map((obs) => obs.species))];

  const filteredObservations = observations
    .filter((obs) => (filteredSpecies ? obs.species === filteredSpecies : true))
    .filter((obs) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        obs.species.toLowerCase().includes(query) ||
        obs.location.toLowerCase().includes(query) ||
        obs.notes.toLowerCase().includes(query)
      );
    });

  return (
    <Tabs className="space-y-4 grow flex flex-col min-h-0">
      <div className="flex justify-between items-center gap-1 flex-col md:flex-row">
        <h1 className="text-xl font-bold text-center">
          Wildlife Observation Log
        </h1>

        <div className="flex items-center gap-2 justify-between md:ml-auto flex-wrap-reverse w-full md:w-auto">
          <TabsList className="w-full sm:w-auto gap-2 flex-wrap grow">
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          <ImportExportActions
            observations={observations}
            onImport={handleImport}
          />
        </div>
      </div>

      <TabsContent
        value="observations"
        className="space-y-6 flex flex-col grow min-h-0 overflow-auto"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search species, location, or notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grow sm:grow-0 flex gap-2">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Observation
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilteredSpecies(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !filteredSpecies
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              All
            </button>
            {uniqueSpecies.map((species) => (
              <button
                key={species}
                onClick={() => setFilteredSpecies(species)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filteredSpecies === species
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {species}
              </button>
            ))}

            <div className="border rounded-md ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="h-8 w-8"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredObservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No observations found matching your criteria.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <ObservationList
            observations={filteredObservations}
            onDelete={deleteObservation}
            onView={openDetailModal}
            onEdit={startEditObservation}
          />
        ) : (
          <ObservationTable
            observations={filteredObservations}
            onDelete={deleteObservation}
            onView={openDetailModal}
            onEdit={startEditObservation}
          />
        )}
      </TabsContent>

      <TabsContent
        value="gallery"
        className="flex flex-col min-h-0 grow overflow-auto"
      >
        <PhotoGallery
          observations={observations}
          onDelete={deleteObservation}
          onEdit={startEditObservation}
        />
      </TabsContent>

      <TabsContent value="charts" className="flex flex-col min-h-0 grow">
        <ObservationChart observations={observations} />
      </TabsContent>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Observation" : "Add New Observation"}
            </DialogTitle>
          </DialogHeader>
          <ObservationForm
            onSubmit={isEditMode ? updateObservation : addObservation}
            initialData={isEditMode ? selectedObservation : undefined}
            onCancel={() => setIsAddModalOpen(false)}
            existingSpecies={uniqueSpecies}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedObservation && (
            <ObservationDetail
              observation={selectedObservation}
              onDelete={deleteObservation}
              onEdit={startEditObservation}
            />
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
