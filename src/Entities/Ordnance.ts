import { MapLocation } from "./MapObjects/MapLocation";
import { OrdnanceCarryingBase } from "./WorldObjects/Bases/AbstractMilitaryBase";

export type OrdnanceTypeLabels = "ICBM" | "Submarine Missile" | "Bomber";

export class Ordnance {

    public myTarget: MapLocation | null;

    public remainingTicksBeforeStriking: number;
    public wasConsumed: boolean; 
    public static nextOrdnanceID: number = 0;
    public myID: number;
    public myBase: OrdnanceCarryingBase;
    public myWorldLabel: OrdnanceTypeLabels;
    public wasIntercepted: boolean;

    constructor(args: {parentBase: OrdnanceCarryingBase}) {

        this.myTarget = null;
        this.remainingTicksBeforeStriking = 0;
        this.wasConsumed = false;
        this.myID = Ordnance.nextOrdnanceID++;
        this.myBase = args.parentBase;
        this.wasIntercepted = false;
        
        if (args.parentBase.WorldObjectLabel === "Missile") {
            this.myWorldLabel = "ICBM";
        }
        else if (args.parentBase.WorldObjectLabel === "Navy") {
            this.myWorldLabel = "Submarine Missile";
        }
        else {
            this.myWorldLabel = "Bomber";
        }
    }
}