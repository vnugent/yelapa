import { FeatureCollection } from "geojson";
import * as Geocoder from "./Geocoder";
//@ts-ignore
import { parse } from "./parser";

class Yelapa {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public parse(
    source: string,
    onData: (ast: any, fc: FeatureCollection) => void,
    onError: (error: any) => void
  ) {
    try {
      const ast = parse(source);
      Geocoder.ast_to_geojson(ast, this.apiKey)
        .then((_fc: FeatureCollection) => onData(ast, _fc))
        .catch(e => onError(e));
    } catch (error) {
      onError(error);
    }
  }
}

export default Yelapa;
