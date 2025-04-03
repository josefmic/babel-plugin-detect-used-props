

import React from "react";
const App = ({
  test,
  test2,
  test3,
  test4,
}: {
  test: any;
  test2: any;
  test3: any;
  test4: any;
}) => {
  return (
    <div>
      <div>{test.property1.property2}</div>
      <div>{test2.property1.property2.property3}</div>
      <div>{test3}</div>
    </div>
  );
};
export default App;