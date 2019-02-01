import { FeatureCollection } from "geojson";
declare class Yelapa {
    private apiKey;
    constructor(apiKey: string);
    parse(source: string, onData: (ast: any, fc: FeatureCollection) => void, onError: (error: any) => void): void;
}
export default Yelapa;
