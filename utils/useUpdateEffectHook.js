import { useEffect, useRef } from "react";

export default function useUpdateNotUndefinedEffect(callback, dependencies) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender == true) {
      firstRender.current = false;
      return;
    }
    return callback();
  }, dependencies);
}
