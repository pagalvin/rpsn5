import { NavyBase } from "./NavyBase";
import { ArmyBase } from "./ArmyBase";
import { RadarBase } from "./RadarBase";
import { MissileBase } from "./MissleBase";
import { AirBase } from "./AirBase";
import { AbmBase } from "./AbmBase";

export type MilitaryBaseTypeLabels = "Navy" | "Army" | "Radar" | "Missile" | "Air" | "ABM";

export type MilitaryBaseTypes = NavyBase | ArmyBase | RadarBase | MissileBase | AirBase | AbmBase;

