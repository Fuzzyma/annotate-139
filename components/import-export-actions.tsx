"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { exportAsJson, importFromJson } from "@/lib/import-export";
import type { Observation } from "@/lib/types";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImportExportActionsProps {
  observations: Observation[];
  onImport: (observations: Observation[]) => void;
}

export function ImportExportActions({
  observations,
  onImport,
}: ImportExportActionsProps) {
  const [isImporting, setIsImporting] = useState(false);

  const handleExportJson = () => {
    try {
      exportAsJson(observations);
      toast.success("Export successful", {
        description: "Your observations have been exported as JSON.",
      });
    } catch (error) {
      console.log(error);
      toast.error("Export failed", {
        description: "There was an error exporting your observations.",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const importedObservations = await importFromJson(file);
      onImport(importedObservations);

      toast.success("Import successful", {
        description: `${importedObservations.length} observations have been imported.`,
      });
    } catch (error) {
      console.log(error);
      toast.error("Import failed", {
        description:
          "There was an error importing your observations. Please check the file format.",
      });
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div className="flex gap-1 w-full sm:w-fit flex-wrap">
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-fit"
        onClick={handleExportJson}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      <div className="relative w-full sm:w-fit">
        <Button
          variant="outline"
          size="sm"
          disabled={isImporting}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
          <input
            type="file"
            accept=".json"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImport}
            disabled={isImporting}
          />
        </Button>
      </div>
    </div>
  );
}
