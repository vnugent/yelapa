import {FeatureCollection, GeoJsonProperties} from "geojson";

export interface FeatureCollection2 extends FeatureCollection {
    properties: GeoJsonProperties
}