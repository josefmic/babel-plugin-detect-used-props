import React, { Component } from "react";
class App extends Component<{
  test: any;
}> {
  render() {
    return (
      <div>
        <div>{this.props.test.property1.property2}</div>
        <div>{this.props.test.property1.property2.property3}</div>
      </div>
    );
  }
}
export default App;
