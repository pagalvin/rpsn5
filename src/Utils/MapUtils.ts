import { MapLocation } from "../Entities/MapObjects/MapLocation";

export class MapUtil {

    public static GetMapLocationSingleCharacterCode(args: {forMapLocation: MapLocation}) {

        if (args.forMapLocation.Contents === null) {
            return "Empty";
        }

        switch (args.forMapLocation.Contents.WorldObjectLabel) {
            case "ABM": return "ABM";
            case "Air": return "Air";
            case "Army": return "Army";
            case "City": return "City";
            case "Missile": return "Msl";
            case "Navy": return "Nvy";
            case "Radar" : return "Rdr";
            case "Rural": return ".";
            case "Town": return "Town";
        }

        return "empty";
    }

}