import { useEffect, useState } from "react";
import { AnyModel } from "@anywidget/types";
export type ObjectHash = Record<string, unknown>;

export function useModelState<
  K extends keyof T,
  V extends T[K],
  T extends ObjectHash = ObjectHash
>(model: AnyModel<T>, name: K) {
  const [value, setValue] = useState<V>(model.get(name) as V);

  const _setValue = (v: V) => {
    // console.log(model, name, v);
    model.set(name, v);
    model.save_changes();
    setValue(v);
  };

  useEffect(() => {
    const handleChange = (_: any, value: V) => {
      setValue(value);
    };
    model.on(`change:${String(name)}`, handleChange);

    return () => model.off(`change:${String(name)}`, handleChange);
  }, []);

  return { value, setValue: _setValue };
}

export function useModelEvent<V, T extends ObjectHash = ObjectHash>(
  model: AnyModel<T>,
  event_type: string,
  defaultValue: V
) {
  const [value, setValue] = useState<V>(defaultValue);

  useEffect(() => {
    const handleEvent = (e: { type: string; value: V }) => {
      if (e.type == event_type) {
        setValue(e.value);
      }
    };
    model.on("msg:custom", handleEvent);

    return () => model.off("msg:custom", handleEvent);
  }, []);

  return value;
}
