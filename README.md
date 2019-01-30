# Yelapa
Yelapa is a parser for Simple Location Markdown Language (SloML).  The library can be used to turn human-readable list of addresses, point of interests or countries into Geojson data.

# How it works
SolML has the following convention
```
This is a short description  
--
Location one
--
location two
--
some address

```
- Separate each entry by two dashes (--)
- Yelapa will perform geocoding look up (using Mapbox) to find GPS coordinates for each entry

Real example:

```
My travels in 2018
--
Berlin
--
Bondi beach
--
Valencia spain
```
Output
```
{
 "type": "FeatureCollection",
 "properties": {
    "description": "My travels in 2018"
  },
 "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.38333,
          52.51667
        ]
      },
      "properties":{"short_code":"DE-BE","wikidata":"Q64"}
    },
    {
     "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          151.273856,
          -33.890896
        ]
      },
      "properties":{"wikidata":"Q673418"}
    },
    {
     "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.375,
          39.46667
        ]
      },
      "properties":{"wikidata":"Q8818"}
    }
  ]
}
```

# Usage

```
# npm install @mappandas/yalepa
```

Yelapa.parse(raw_input, onData(ast, featureCollection) , onError(error));

```
import Yelapa from "@mappandas/yelapa";

...

    const geocoder = new Yelapa(
      "mapbox API key"
    );
  
  const input =¨"My travels in 2018\n--\nberlin\--\ntokyo";
   geocoder.parse(
      input,
      (ast: any, fc: FeatureCollection) => {
         // ast: syntax tree data
         // fc: featurecollection
      },
      (e:any) => {
       // handle error
      }
    );
```
