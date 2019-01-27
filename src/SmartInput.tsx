import * as React from "react";
import ContentEditable from "react-contenteditable";
import sanitize from "sanitize-html";
//import InputBase from "@material-ui/core/InputBase";
import { parser, SyntaxError } from "./parser";
import * as Geocoder from "./Geocoder";
import { FeatureCollection } from "geojson";

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

  constructor(props: IProps) {
    super(props);

    this.state = {
      raw: "This is the header",
      ast: {},
      fc: Geocoder.EMPTY_FC,
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
    try {
      const ast = parser(text);
      console.log("AST ", ast);
      Geocoder.ast_to_geojson(ast).then(_fc => {
        console.log("FC ", _fc.features.length);
        this.setState(
          { raw: text, ast: ast, fc: _fc, error: undefined },
          () => {
            if (this.props.onDataUpdate) {
              console.log("callback");
              this.props.onDataUpdate(_fc);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
      this.setState({ raw: text, error: error });
    }
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
