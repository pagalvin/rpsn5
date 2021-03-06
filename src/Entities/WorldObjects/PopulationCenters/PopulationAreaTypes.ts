import { MajorTown } from "./MajorTown";
import { City } from "./City";
import { RuralArea } from "./Rural";

export type PopulationAreaTypeLabels = "City" | "Town" | "Rural" | null;

export type PopulationAreaTypes = City | MajorTown | RuralArea;
