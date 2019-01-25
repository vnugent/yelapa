import * as React from "react";
import ContentEditable from "react-contenteditable";
import sanitize from "sanitize-html";
//import InputBase from "@material-ui/core/InputBase";
import { parser, SyntaxError } from "./parser";

export interface IProps {}

export interface IState {
  value: string;
}

export default class I extends React.Component<IProps, IState> {
  contentEditable = React.createRef<HTMLTextAreaElement>();

  constructor(props: IProps) {
    super(props);

    this.state = {
      value: "This is the header"
    };
  }

  handleChange = (event: any) => {
    const text = event.target.value;

    const opts: any = {
      allowedTags: ["br"],
      allowedAttributes: {},
    //   transformTags: {
    //     div: function(tagName: any, attribs: any, text: string) {
    //       console.log("sanitizing", tagName, text);
    //       return text + "\r\n";
    //     },
    //     br: ";"
    //   }
    };

    const cleanText = sanitize(text, opts);

    console.log("raw text ", text);
    console.log("clean ", cleanText);
    try {
      const data = parser(text.trim() + "\n");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    this.setState({ value: text });
  };

  public render() {
    return (
      <textarea
        ref={this.contentEditable}
        value={this.state.value} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={this.handleChange} // handle innerHTML change
        />
    );
  }
}
