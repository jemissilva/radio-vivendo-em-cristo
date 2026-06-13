import { useEffect, useState } from "react";

export function useAsyncData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const result = await loader();
        if (active) {
          setData(result);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : "Erro inesperado");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [loader]);

  return { data, loading, error };
}