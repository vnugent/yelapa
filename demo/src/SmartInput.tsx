import * as React from "react";
import ContentEditable from "react-contenteditable";
import * as Yelapa from "@mappandas/yelapa";
//import {FeatureCollection2} from "@mappandas/yelapa/Types"
import sanitize from "sanitize-html";
//import InputBase from "@material-ui/core/InputBase";
import { FeatureCollection } from "geojson";

export const EMPTY_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: []
};

export interface IProps {
  className?: string;
  onDataUpdate?: (fc: FeatureCollection) => void;
}

export interface IState {
  raw: string;
  ast: any;
  fc: FeatureCollection;
  error: any;
}

export default class I extends React.Component<IProps, IState> {
  contentEditable = React.createRef<HTMLTextAreaElement>();
  geocoder = new Yelapa.Geocoder(
    "pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
  );
  constructor(props: IProps) {
    super(props);

    this.state = {
      raw: "This is the header",
      ast: {},
      fc: EMPTY_FC,
      error: undefined
    };
  }

  handleChange = (event: any) => {
    const text = event.target.value;

    const opts: any = {
      allowedTags: ["br"],
      allowedAttributes: {}
      //   transformTags: {
      //     div: function(tagName: any, attribs: any, text: string) {
      //       console.log("sanitizing", tagName, text);
      //       return text + "\r\n";
      //     },
      //     br: ";"
      //   }
    };

    const cleanText = sanitize(text, opts);

    //console.log("raw text ", text);
    //console.log("clean ", cleanText);
    this.geocoder.parse(text).then(({ast, fc}) => {
        this.setState(
          { raw: text, ast: ast, fc: fc, error: undefined },
          () => {
            if (this.props.onDataUpdate) {
              console.log("callback", ast, JSON.stringify(fc));
              this.props.onDataUpdate(fc);
            }
          }
        );
      }
      ).catch((e: any) => {
        this.setState({ raw: text, error: e });
      }
    );
  };

  Error = (p: any) => {
    const msg = p.error ? p.error.message : "None";
    return <div>Error: {msg}</div>;
  };

  public render() {
    const { className } = this.props;
    const clz = className ? { className: className } : " ";

    return (
      <div {...clz}>
        <textarea
          rows={20}
          cols={100}
          ref={this.contentEditable}
          value={this.state.raw} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onChange={this.handleChange} // handle innerHTML change
        />
        <this.Error error={this.state.error} />
      </div>
    );
  }
}
