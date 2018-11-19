import { MapLocation } from "./MapObjects/MapLocation";
import { OrdnanceCarryingBase } from "./WorldObjects/Bases/AbstractMilitaryBase";

export class Ordnance {

    public myTarget: MapLocation | null;

    public remainingTicksBeforeStriking: number;
    public wasConsumed: boolean; 
    public static nextOrdnanceID: number = 0;
    public myID: number;
    public myBase: OrdnanceCarryingBase;

    constructor(args: {parentBase: OrdnanceCarryingBase}) {

        this.myTarget = null;
        this.remainingTicksBeforeStriking = 0;
        this.wasConsumed = false;
        this.myID = Ordnance.nextOrdnanceID++;
        this.myBase = args.parentBase;
    }
}