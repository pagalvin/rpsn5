
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { Rng } from "../../../Utils/Rng";

export interface MilitaryBaseProperties {
    Name: string;
    Age: number;
    WorldObjectLabel: MilitaryBaseTypeLabels;
    isReceivingOrders: boolean;
    myMapLocation: MapLocation;
}

export interface MilitaryBaseActions {
    activate: () => void;
}

export interface OrdnanceCarryingBase {
    ordnance: Ordnance[];
    WorldObjectLabel: MilitaryBaseTypeLabels;
}

export abstract class AbstractMilitaryBase implements MilitaryBaseProperties, MilitaryBaseActions
{

    public Name: string = "";
    public Age: number = 0;
    public isReceivingOrders: boolean;
    public myMapLocation: MapLocation;
    public Population: number = Rng.throwDice({hiNumberMinus1: 10000}) + 10000;

    // Having a "BaseType" label here helps some code work a little more generically since "typeof [any base object]" returns "object"
    // This gives us a shot at treating bases a little more generically. Look at MilitaryBaseFactory.ts for an example.
    public abstract WorldObjectLabel: MilitaryBaseTypeLabels;

    public activate() {
        this.isReceivingOrders = true;
    };

    constructor(args: {atLocation: MapLocation}) {
        this.isReceivingOrders = false;
        this.myMapLocation = args.atLocation;
    }
    
}
