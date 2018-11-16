import { MapLocation } from "./MapObjects/MapLocation";
import { MissileBase } from "./WorldObjects/Bases/MissileBase";

export class Missile {

    public myTarget: MapLocation | null;

    public remainingTicksBeforeStriking: number;

    public static nextMissileID: number = 0;
    public myID: number;
    public myBase: MissileBase;

    constructor(args: {parentBase: MissileBase}) {

        this.myTarget = null;
        this.remainingTicksBeforeStriking = 0;

        this.myID = Missile.nextMissileID++;
        this.myBase = args.parentBase;
    }
}