import React, { Component } from "react";
class App extends Component<{
  test: any;
}> {
  render() {
    return <div>{this.props.test}</div>;
  }
}
export default App;
