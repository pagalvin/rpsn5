
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { Ordnance } from "../../Ordnance";

export interface MilitaryBaseProperties {
    Name: string;
    Age: number;
    WorldObjectLabel: MilitaryBaseTypeLabels;
    isReceivingOrders: boolean;
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
    
    // Having a "BaseType" label here helps some code work a little more generically since "typeof [any base object]" returns "object"
    // This gives us a shot at treating bases a little more generically. Look at MilitaryBaseFactory.ts for an example.
    public abstract WorldObjectLabel: MilitaryBaseTypeLabels;

    public activate() {
        this.isReceivingOrders = true;
    };

    constructor() {
        this.isReceivingOrders = false;
    }
    
}
