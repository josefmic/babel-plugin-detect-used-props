

import React from "react";
const App = ({ test }: { test: any }) => {
  return <div>{test.property1.property2.property3}</div>;
};
export default App;