import React, { Component } from "react";
import { FeatureCollection } from "geojson";

import SmartInput from "./SmartInput";
import * as GeoUtils from "./GeoUtils";
import MinimalMap from "./MiniMap";

export interface IAppProps {}

export interface IAppState {
  geojson: FeatureCollection;
  viewstate: any;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      geojson: GeoUtils.NEW_FC(),
      viewstate: GeoUtils.INITIAL_VIEWSTATE
    };
  }

  render() {
    const { geojson, viewstate } = this.state;

    return (
      <div>
        <SmartInput
          className="smart-input"
          onDataUpdate={this._handleDataChange}
        />
        <MinimalMap geojson={geojson} viewstate={viewstate} />
      </div>
    );
  }

  _handleDataChange = (fc: FeatureCollection) => {
    const bbox = GeoUtils.bboxFromGeoJson(fc);
    const newViewstate =
      fc.features.length === 0
        ? GeoUtils.INITIAL_VIEWSTATE
        : {
            ...GeoUtils.INITIAL_VIEWSTATE,
            ...GeoUtils.bbox2Viewport(bbox)
          };
    this.setState({ geojson: fc, viewstate: newViewstate });
  };
}

export default App;
