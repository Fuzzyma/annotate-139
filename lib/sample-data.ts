import type { Observation } from "./types";

// Helper function to generate a random date within a month
function randomDateInMonth(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return new Date(year, month, day);
}

// Helper function to generate a random number between min and max
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSampleData(): Observation[] {
  const species = [
    "Red Fox",
    "Great Blue Heron",
    "Bald Eagle",
    "Raccoon",
    "Coyote",
  ] as const;
  const locations = [
    "Woodland Park, 47.6688, -122.3463",
    "Lake Washington, 47.6097, -122.2559",
    "Discovery Park, 47.6612, -122.4060",
    "Magnuson Park, 47.6795, -122.2568",
    "Green Lake, 47.6806, -122.3294",
    "Carkeek Park, 47.7125, -122.3782",
    "Union Bay Natural Area, 47.6565, -122.2946",
    "Seward Park, 47.5508, -122.2649",
    "Ravenna Park, 47.6717, -122.3063",
    "Washington Park Arboretum, 47.6359, -122.2944",
    "Golden Gardens, 47.6917, -122.4019",
    "Lincoln Park, 47.5305, -122.3961",
    "Volunteer Park, 47.6301, -122.3158",
    "Interlaken Park, 47.6342, -122.3073",
  ];

  const foxNotes = [
    "Spotted at dawn, hunting near the edge of the forest.",
    "With cubs, playing in a meadow.",
    "Crossing a path with prey in its mouth.",
    "Hunting voles in the tall grass.",
    "Cubs playing outside den entrance.",
    "Adult teaching cubs to hunt.",
    "Carrying prey back to den site.",
    "Marking territory at dawn.",
    "Hunting near Japanese Garden.",
    "Beautiful winter coat, hunting at dusk.",
    "Pouncing on prey beneath snow.",
  ];

  const heronNotes = [
    "Standing in shallow water, very still, waiting for fish.",
    "Fishing in the shallows, caught a small fish.",
    "Standing on one leg at the edge of the pond.",
    "Nesting in the tall trees with several others.",
    "Juvenile learning to fish in shallow water.",
    "Flying with large fish in its beak.",
    "Territorial display with another heron.",
    "Preening feathers on log.",
    "Hunting in tidal pools at low tide.",
    "Stoic in light snowfall, still fishing.",
  ];

  const eagleNotes = [
    "Perched on a tall Douglas fir, scanning the water.",
    "Pair of eagles soaring over the lake.",
    "Spotted carrying nesting material.",
    "Feeding young in the nest.",
    "Young eagle practicing flight.",
    "Perched on snag overlooking the lake.",
    "Diving for fish near the lighthouse.",
    "Harassing osprey to steal fish.",
    "Pair calling to each other across the bay.",
    "Soaring over snow-covered landscape.",
  ];

  const raccoonNotes = [
    "Family of raccoons foraging near the water's edge at dusk.",
    "Washing food in the creek.",
    "Climbing trees near the amphitheater.",
    "Family group foraging along the creek.",
    "Raiding trash cans near the Asian Art Museum.",
    "Sleeping in tree hollow during daytime.",
    "Gathering food before winter.",
    "Preparing winter den in hollow tree.",
    "Tracks in fresh snow leading to den.",
    "Mother with young kits exploring near the conservatory.",
  ];

  const coyoteNotes = [
    "Lone coyote trotting along a trail in the early morning.",
    "Hunting in the tall grass at sunset.",
    "Pack of three hunting together at dusk.",
    "Howling at dusk near the meadow.",
    "Resting in shade during hot afternoon.",
    "Chasing small rodents in field.",
    "Pack of four moving through forest edge.",
    "Lone individual with thick winter coat.",
    "Howling in moonlight on winter solstice.",
  ];

  const speciesNotes = {
    "Red Fox": foxNotes,
    "Great Blue Heron": heronNotes,
    "Bald Eagle": eagleNotes,
    Raccoon: raccoonNotes,
    Coyote: coyoteNotes,
  };

  const observations: Observation[] = [];
  let id = 1;

  // Generate observations for each month with varying frequencies and multiple sightings per species
  for (let month = 0; month < 12; month++) {
    // For each species, generate multiple observations for this month
    species.forEach((speciesName) => {
      // Make the frequency vary by month and species to create interesting patterns
      let frequency = 0;

      // Create seasonal patterns
      if (speciesName === "Red Fox") {
        frequency = [1, 2, 3, 4, 2, 1, 0, 0, 1, 3, 4, 3][month];
      } else if (speciesName === "Great Blue Heron") {
        frequency = [1, 2, 3, 4, 3, 3, 2, 4, 4, 3, 2, 1][month];
      } else if (speciesName === "Bald Eagle") {
        frequency = [1, 3, 4, 3, 2, 1, 1, 2, 3, 4, 5, 2][month];
      } else if (speciesName === "Raccoon") {
        frequency = [2, 2, 3, 4, 2, 2, 4, 2, 1, 2, 4, 3][month];
      } else if (speciesName === "Coyote") {
        frequency = [2, 5, 4, 3, 2, 1, 2, 3, 4, 2, 1, 3][month];
      }

      // Add some randomness
      frequency = Math.max(1, frequency + randomBetween(-1, 1));

      // Generate multiple sightings per species per month
      // Multiply frequency by 2-4 to ensure multiple sightings
      const actualFrequency = frequency * randomBetween(0, 2);

      for (let i = 0; i < actualFrequency; i++) {
        const date = randomDateInMonth(2023, month);
        const locationIndex = randomBetween(0, locations.length - 1);
        const notesArray = speciesNotes[speciesName];
        const noteIndex = randomBetween(0, notesArray.length - 1);

        observations.push({
          id: String(id++),
          species: speciesName,
          photo: "/placeholder.svg?height=300&width=400",
          location: locations[locationIndex],
          date: date,
          notes: notesArray[noteIndex],
          timestamp: date.toISOString(),
        });
      }
    });
  }

  return observations;
}
