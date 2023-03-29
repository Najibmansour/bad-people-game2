import { useEffect, useRef } from "react";

export default function useUpdateNotUndefinedEffect(callback, dependencies) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (dependencies[0] == undefined) {
      //   firstRender.current = false;
      return;
    }
    return callback();
  }, dependencies);
}
