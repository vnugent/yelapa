import { FeatureCollection, Feature, GeoJsonProperties } from "geojson";
import axios from "axios";
import { FeatureCollection2 } from "././Types";

export const EMPTY_FC: FeatureCollection2 = {
  type: "FeatureCollection",
  features: [],
  properties: null
};

const geocoder_lookup1 = async (
  query: string,
  apiToken: string
): Promise<FeatureCollection> => {
  const safeQuery = encodeURI(query);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${apiToken}&limit=1`;
  const response = await axios.get(url);
  return response.data;
};

export const find = async (
  query: string,
  apiToken: string
): Promise<Feature | null> => {
  const data = await geocoder_lookup1(query, apiToken)
    .then(result => {
      return result.features[0];
    })
    .catch(error => {
      return null;
    });
  return data;
};

export const ast_to_geojson = async (
  ast: any,
  apiToken: string
): Promise<FeatureCollection2> => {
  const data = ast.entries;
  if (data && Array.isArray(data)) {
    var _features: Feature[] = [];
    for (let entry of data) {
      if (!entry.name) {
        continue;
      }
      const name = entry.name.value;
      const feature = await find(name, apiToken);
      if (feature != null) {
        //feature.properties = create_feature_props(entry);
        // re-build feature object because we don't need other data fields
        _features.push({
          type: "Feature",
          geometry: feature.geometry,
          properties: create_feature_props(entry)
        });
      }
    }
    return {
      type: "FeatureCollection",
      properties: create_global_props(ast),
      features: _features
    };
  }
  return EMPTY_FC;
};

const create_global_props = (ast: any): GeoJsonProperties => ({
  title: ast.title.value,
  summary: ast.summary.value
});

const create_feature_props = (entry: any): GeoJsonProperties => ({
  name: entry.name.value,
  description: entry.description.value
});
