import { AbstractMilitaryBase } from "../WorldObjects/Bases/AbstractMilitaryBase";
import { AbstractPopulationArea } from "../WorldObjects/PopulationCenters/AbstractPopulationArea";
import { MilitaryBaseTypeLabels, MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypeLabels, PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

// export type PlaceableObject = AbstractMilitaryBase | AbstractPopulationArea;
export type PlaceableObject = MilitaryBaseTypes | PopulationAreaTypes;
export type PlaceableObjectLabels = MilitaryBaseTypeLabels | PopulationAreaTypeLabels | null;