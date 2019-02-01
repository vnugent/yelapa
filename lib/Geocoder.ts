import { FeatureCollection, Feature } from "geojson";
import axios from "axios";

export const EMPTY_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: []
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
): Promise<Feature | undefined> => {
  const p = await geocoder_lookup1(query, apiToken)
    .then(result => {
      return result.features[0];
    })
    .catch(error => {
      return undefined;
    });
  return p;
};

export const ast_to_geojson = async (
  ast: any,
  apiToken: string
): Promise<FeatureCollection> => {
  const data = ast.rest;
  if (data && Array.isArray(data)) {
    var _features: Feature[] = [];
    for (let entry of data) {
      const name = entry.name.value;
      const _location = entry.address ? entry.address.value : undefined;
      const _searchStr = _location ? _location : name;
      await find(_searchStr, apiToken)
        .then(feature => {
          if (feature) _features.push(feature);
        })
        .catch(e => {
          console.log("can't determine location ", e);
        });
    }
    return {
      type: "FeatureCollection",
      features: _features
    };
  }
  return EMPTY_FC;
};
