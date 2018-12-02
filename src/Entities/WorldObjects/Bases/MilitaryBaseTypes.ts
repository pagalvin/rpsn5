import { NavyBase } from "./NavyBase";
import { ArmyBase } from "./ArmyBase";
import { RadarBase } from "./RadarBase";
import { MissileBase } from "./MissileBase";
import { AirBase } from "./AirBase";
import { AbmBase } from "./AbmBase";

export type MilitaryBaseTypeLabels = "Navy" | "Army" | "Radar" | "Missile" | "Air" | "ABM" | null;

export type MilitaryBaseTypes = NavyBase | ArmyBase | RadarBase | MissileBase | AirBase | AbmBase | null;

export type NonNullMilitaryBaseTypes = Exclude<MilitaryBaseTypes,null>;
