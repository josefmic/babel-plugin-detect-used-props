

import React from "react";
const App = ({ test }: { test: any }) => {
  return (
    <div>
      <div>{test.property1.property2}</div>
      <div>{test.property1.property2}</div>
    </div>
  );
};
export default App;