"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Upload,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Observation } from "@/lib/types";

const formSchema = z.object({
  species: z.string().min(2, {
    message: "Species must be at least 2 characters.",
  }),
  location: z.string().min(3, {
    message: "Location is required.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ObservationFormProps {
  onSubmit: (observation: Observation) => void;
  onCancel?: () => void;
  initialData?: Observation | null;
  existingSpecies?: string[];
}

export function ObservationForm({
  onSubmit,
  onCancel,
  initialData,
  existingSpecies = [],
}: ObservationFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [openSpeciesCombobox, setOpenSpeciesCombobox] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      species: initialData?.species || "",
      location: initialData?.location || "",
      notes: initialData?.notes || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
    },
  });

  useEffect(() => {
    if (initialData?.photo) {
      setPhotoPreview(initialData.photo);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match("image.*")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoPreview(null);
  };

  const handleSubmit = (values: FormValues) => {
    const newObservation: Observation = {
      id: initialData?.id || crypto.randomUUID(),
      species: values.species,
      location: values.location,
      date: values.date,
      notes: values.notes || "",
      photo: photoPreview || "",
      timestamp: initialData?.timestamp || new Date().toISOString(),
    };

    onSubmit(newObservation);
    if (!isEditing) {
      form.reset();
      setPhotoPreview(null);
    }
  };

  // Create a unique list of species
  const uniqueSpecies = Array.from(new Set(existingSpecies)).sort();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Species</FormLabel>
              <Popover
                open={openSpeciesCombobox}
                onOpenChange={setOpenSpeciesCombobox}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSpeciesCombobox}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Select or enter a species"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search or add new species..."
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {field.value ? (
                          <div className="py-3 px-4 text-sm">
                            Press Enter to add &qout;{field.value}&qout;
                          </div>
                        ) : (
                          "No species found."
                        )}
                      </CommandEmpty>
                    </CommandList>
                    {uniqueSpecies.length > 0 && (
                      <CommandList>
                        <CommandGroup heading="Existing Species">
                          {uniqueSpecies.map((species) => (
                            <CommandItem
                              key={species}
                              value={species}
                              onSelect={() => {
                                form.setValue("species", species);
                                setOpenSpeciesCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  species === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {species}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50",
            photoPreview ? "h-auto" : "h-40"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {photoPreview ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-2 right-2 bg-muted text-muted-foreground rounded-full p-1 hover:bg-muted/90"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Preview"
                className="max-h-64 mx-auto rounded-md"
              />
              <p className="text-sm text-muted-foreground">
                Click or drag to change image
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF
              </p>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. Central Park, New York or 40.7128,-74.0060"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Behavior, habitat, weather conditions, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Update" : "Add"} Observation
          </Button>
        </div>
      </form>
    </Form>
  );
}
