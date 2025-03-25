import type { Observation } from "./types";

// Export observations as JSON
export function exportAsJson(
  observations: Observation[],
  filename = "wildlife-observations.json"
) {
  const data = JSON.stringify(observations, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  // create dynamic link and click to download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Import observations from JSON file
export async function importFromJson(file: File): Promise<Observation[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }

        const json = JSON.parse(event.target.result as string);

        // Validate the imported data
        if (!Array.isArray(json)) {
          throw new Error("Imported data is not an array");
        }

        // Convert dates from string to Date objects if needed
        const observations = json.map((item) => ({
          ...item,
          date: new Date(item.date),
          id: item.id || crypto.randomUUID(), // Ensure each item has an ID
          timestamp: item.timestamp || new Date().toISOString(),
        }));

        resolve(observations);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
}
