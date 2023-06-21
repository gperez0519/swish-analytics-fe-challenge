import React from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import playerProps from "./mockData/props.json";
import PlayerPropsTable from "./components/PlayerPropsTable/PlayerPropsTable";

function App() {
  return (
    <div className="App">
      <PlayerPropsTable />
    </div>
  );
}

export default App;
