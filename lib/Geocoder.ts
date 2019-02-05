import { FeatureCollection2 } from "./Types";
import * as Mapbox from "./Mapbox";
//@ts-ignore
import { parse } from "./parser";

class Geocoder {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  parse = async (
    source: string
  ): Promise<{ ast: any; fc: FeatureCollection2 }> => {
    try {
      const ast = parse(source);
      const fc = await Mapbox.ast_to_geojson(ast, this.apiKey);
      return { ast, fc };
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export {Geocoder};
