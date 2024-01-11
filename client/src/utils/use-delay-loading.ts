import { useEffect, useState } from "react";

export const useDelayLoading = (delay = 1000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return loading;
};
