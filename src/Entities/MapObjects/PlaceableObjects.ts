import { AbstractMilitaryBase } from "../WorldObjects/Bases/AbstractMilitaryBase";
import { AbstractPopulationArea } from "../WorldObjects/PopulationCenters/AbstractPopulationArea";
import { MilitaryBaseTypeLabels } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypeLabels } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

export type PlaceableObject = AbstractMilitaryBase | AbstractPopulationArea;
export type PlaceableObjectLabels = MilitaryBaseTypeLabels | PopulationAreaTypeLabels;