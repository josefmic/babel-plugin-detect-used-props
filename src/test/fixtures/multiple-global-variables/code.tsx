

import React from "react";
const App = () => {
  return (
    <div>
      <div>{window.location.search}</div>
      <div>{window.location.hash}</div>
    </div>
  );
};
export default App;