import * as React from "react";
import ReactDOM from "react-dom/client";
import { AnyModel, Render } from "@anywidget/types";
import confetti from "canvas-confetti";

import "./style.css";

type DemoProps = {
  value: number;
};

const RenderContext = React.createContext<AnyModel<DemoProps> | null>(null);

export function RenderProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: AnyModel<DemoProps> }>) {
  return (
    <RenderContext.Provider value={value}>{children}</RenderContext.Provider>
  );
}

export function useModelState<T extends keyof DemoProps>(
  name: T
): [DemoProps[T], React.Dispatch<DemoProps[T]>] {
  const context = React.useContext(RenderContext);

  if (context == null || typeof context === "undefined") {
    throw new Error("`useModelState` called outside `RenderContext.Provider`!");
  }

  const [value, setValue] = React.useState(context.get(name));

  const _setValue = (x: any) => {
    context.set(name, x);
    context.save_changes();

    setValue(x);
  };

  React.useEffect(() => {
    const onModelValueChanged = (_: any, e: DemoProps[T]) => {
      setValue(e);
      confetti();
    };
    context.on(`change:${name}`, onModelValueChanged);

    return () => context.off(`change:${name}`, onModelValueChanged);
  }, [name]);

  return [value, _setValue];
}

/**
 * @param {React.FC} Widget
 * @returns {import("@anywidget/types").Render}
 */
export function createRender(Widget: React.FC): Render<DemoProps> {
  return ({ el, model }) => {
    let root = ReactDOM.createRoot(el);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          RenderContext.Provider,
          { value: model },
          React.createElement(Widget)
        )
      )
    );
    return () => root.unmount();
  };
}

const render = createRender(() => {
  const [value, setValue] = useModelState("value");
  return (
    <button
      className="counter-button select-none"
      onClick={() => setValue(value + 1)}
    >
      count is {value}
    </button>
  );
});

export default { render };
