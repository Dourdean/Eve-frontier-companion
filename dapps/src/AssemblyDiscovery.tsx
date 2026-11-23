import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { getCharacterAndOwnedObjects } from "@evefrontier/dapp-kit/graphql";

export function AssemblyDiscovery() {
  const account = useCurrentAccount();
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account?.address) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    setData(null);
    setError("");
    setLoading(true);

    getCharacterAndOwnedObjects(account.address)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [account?.address]);

  return (
    <section>
      <h3>Smart Assembly Discovery Test</h3>
      {!account && <p>Connect EVE Vault to begin.</p>}
      {loading && <p>Loading character data...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {data !== null && (
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}
