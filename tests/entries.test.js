import * as _ from "lodash";
import * as Yelapa from "../dist";
import * as Mapbox from "../dist/Mapbox";

const FC = {
  type: "FeatureCollection",
  features: [],
  properties: {
    title: "this is the header",
    summary: ["foo bar"]
  }
};

const F1 = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordindates: [1, 1]
  },
  properties: { name: "San Francisco, CA", description: [] }
};

const F2 = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordindates: [1, 1]
  },
  properties: {
    name: "Tokyo",
    description: ["Lorem ipsum dolor", "Excepteur sint occaecat,"]
  }
};

Mapbox.find = jest.fn();

test("1 entry name only", async () => {
  const EXPECTED_FC = _.cloneDeep(FC);
  EXPECTED_FC.features = [_.cloneDeep(F1)];

  Mapbox.find.mockReturnValue(Promise.resolve(F1));

  const s = `this is the header\nfoo bar\n--\nSan Francisco, CA\n`;

  const geocoder = new Yelapa.Geocoder("secret");
  const d = await geocoder.parse(s);

  expect(d.fc).toEqual(EXPECTED_FC);
});

test("2 entries name and description", async () => {
  const EXPECTED_FC = _.cloneDeep(FC);
  EXPECTED_FC.features = [_.cloneDeep(F1), _.cloneDeep(F2)];

  Mapbox.find.mockReturnValue(Promise.resolve(F1));
  Mapbox.find.mockReturnValueOnce(Promise.resolve(F2));

  const s = `this is the header\nfoo bar\n--\nSan Francisco, CA\n\n--\n\nTokyo\nLorem ipsum dolor\nExcepteur sint occaecat,\n`;

  const geocoder = new Yelapa.Geocoder("secret");

  const d = await geocoder.parse(s);
  expect(d.fc.features.length).toBe(EXPECTED_FC.features.length);

  expect(d.fc).toEqual(EXPECTED_FC);
});
