
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Ordnance } from "../../Ordnance";
import { MapLocation } from "../../MapObjects/MapLocation";
import { Rng } from "../../../Utils/Rng";
import { AbstractBaseNameFactory as AbstractBaseNameFactory } from "../../../Factories/BaseNameFactories/AbstractBaseNameFactory";

export interface MilitaryBaseProperties {
    Name: string;
    WorldObjectLabel: MilitaryBaseTypeLabels;
    isReceivingOrders: boolean;
    myMapLocation: MapLocation;
    yearBuilt: number;
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
    public isReceivingOrders: boolean;
    public myMapLocation: MapLocation;
    public Population: number = Rng.throwDice({hiNumberMinus1: 10000}) + 10000;
    public wasDestroyed: boolean = false;
    public yearBuilt: number;

    protected abstract baseNameFactory: AbstractBaseNameFactory;

    // Having a "BaseType" label here helps some code work a little more generically since "typeof [any base object]" returns "object"
    // This gives us a shot at treating bases a little more generically. Look at MilitaryBaseFactory.ts for an example.
    public abstract WorldObjectLabel: MilitaryBaseTypeLabels;

    public activate() {
        this.isReceivingOrders = true;
    };

    constructor(args: {atLocation: MapLocation, yearBuilt: number}) {
        this.isReceivingOrders = false;
        this.myMapLocation = args.atLocation;
        this.yearBuilt = args.yearBuilt;
    }
    
}
