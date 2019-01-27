import { FeatureCollection, Feature } from "geojson";
import axios from "axios";

const TOKEN =
  "pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg";

export const EMPTY_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: []
};

const geocoder_lookup1 = async (query: string): Promise<FeatureCollection> => {
  const safeQuery = encodeURI(query);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${TOKEN}&limit=1`;
  const response = await axios.get(url);
  return response.data;
};

export const find = async (query: string): Promise<Feature | undefined> => {
  console.log("Searching ", query);
  const p = await geocoder_lookup1(query)
    .then(result => {
      return result.features[0];
    })
    .catch(error => {
      return undefined;
    });
  return p;
};

export const ast_to_geojson = async (ast: any): Promise<FeatureCollection> => {
  const data = ast.rest;
  if (data && Array.isArray(data)) {
    var _features: Feature[] = [];
    for (let entry of data) {
      const name = entry.name.value;
      const _location = entry.address ? entry.address.value : undefined;
      const _searchStr = _location ? _location : name;
      await find(_searchStr)
        .then(feature => {
          console.log("Found ", feature);
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
