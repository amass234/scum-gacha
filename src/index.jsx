import React from "react";
import ReactDOM from "react-dom";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import App from "./components/app";

const MyApp = () => {
  return <App />;
};

ReactDOM.render(<MyApp />, document.getElementById("root"));
