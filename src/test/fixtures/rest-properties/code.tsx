

import React from "react";
const App = ({ ...rest }) => {
  return <div>{JSON.stringify(rest)}</div>;
};
export default App;