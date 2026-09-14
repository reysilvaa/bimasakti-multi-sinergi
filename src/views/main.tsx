import { render } from "preact";
import { App } from "@/views/App.js";

const root = document.getElementById("root");
if (root) {
  render(<App />, root);
}
