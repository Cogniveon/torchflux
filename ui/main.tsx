import React from "react";
import ReactDOM from "react-dom/client";
import { RenderProps, AnyModel } from "@anywidget/types";

import "./style.css";
import { ObjectHash, useModelEvent, useModelState } from "./utils";

interface TorchFluxProps extends ObjectHash {
  value: number;
}

function App({ model }: { model: AnyModel<TorchFluxProps> }) {
  const { value, setValue } = useModelState(model, "value");
  const progress = useModelEvent<number>(model, "progress", 0);

  return (
    <button
      className="torchflux-counter-button"
      onClick={() => {
        setValue(value + 1);
      }}
    >
      count is {value}, progress is {progress}
    </button>
  );
}

function render({ model, el }: RenderProps<TorchFluxProps>) {
  let root = ReactDOM.createRoot(el);

  root.render(
    <React.StrictMode>
      <App model={model} />
    </React.StrictMode>
  );
  return () => root.unmount();
}

export default { render };
