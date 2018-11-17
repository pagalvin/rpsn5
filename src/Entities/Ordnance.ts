import { MapLocation } from "./MapObjects/MapLocation";
import { MissileBase } from "./WorldObjects/Bases/MissileBase";
import { NavyBase } from "./WorldObjects/Bases/NavyBase";
import { AirBase } from "./WorldObjects/Bases/AirBase";

export class Ordnance {

    public myTarget: MapLocation | null;

    public remainingTicksBeforeStriking: number;

    public static nextOrdnanceID: number = 0;
    public myID: number;
    public myBase: MissileBase | NavyBase | AirBase;

    constructor(args: {parentBase: MissileBase | NavyBase | AirBase}) {

        this.myTarget = null;
        this.remainingTicksBeforeStriking = 0;

        this.myID = Ordnance.nextOrdnanceID++;
        this.myBase = args.parentBase;
    }
}