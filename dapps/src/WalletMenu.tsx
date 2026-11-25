import { useState, useEffect, useRef } from "react";
import {
  useCurrentAccount,
  useDAppKit,
  useWallets,
} from "@mysten/dapp-kit-react";
import {
  abbreviateAddress,
  STORAGE_KEYS,
} from "@evefrontier/dapp-kit";

export function WalletMenu() {
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const wallets = useWallets();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuRef.current?.querySelector("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const supportedWallets = wallets.filter(
    (wallet) =>
      wallet.name.includes("Eve Vault") ||
      wallet.name.includes("EVE Frontier Client Wallet")
  );

  async function connectWallet(
    wallet: (typeof wallets)[number]
  ) {
    setBusy(true);
    setMessage("Connecting...");
    try {
      await dAppKit.connectWallet({ wallet });
      localStorage.setItem(STORAGE_KEYS.CONNECTED, "true");
      setMessage("Connection completed.");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  }

  async function disconnectWallet() {
    setBusy(true);
    setMessage("Disconnecting...");
    try {
      await dAppKit.disconnectWallet();
      localStorage.removeItem(STORAGE_KEYS.CONNECTED);
      setMessage("Wallet disconnected.");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  }

  async function copyAddress() {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account.address);
      setMessage("Wallet address copied.");
    } catch (error) {
      setMessage(String(error));
    }
  }

  return (
    <div className="wallet-menu" ref={menuRef}>
      <button
        type="button"
        className="wallet-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {account
          ? abbreviateAddress(account.address)
          : "Connect Wallet"} ▾
      </button>

      {open && (
        <div className="wallet-dropdown">
          <strong>WALLET CONTROL</strong>

          <p>
            {account
              ? "● Wallet connected"
              : "○ Wallet disconnected"}
          </p>

          {account ? (
            <>
              <button onClick={copyAddress}>
                Copy wallet address
              </button>

              <button
                disabled={busy}
                onClick={disconnectWallet}
                className="wallet-disconnect"
              >
                Disconnect wallet
              </button>
            </>
          ) : (
            <>
              {supportedWallets.map((wallet, index) => (
                <button
                  key={index}
                  disabled={busy}
                  onClick={() => connectWallet(wallet)}
                >
                  Connect {wallet.name}
                </button>
              ))}

              {supportedWallets.length === 0 && (
                <p>No supported EVE wallet detected.</p>
              )}
            </>
          )}

          <details>
            <summary>Connection details</summary>
            <p>
              Supported wallets: {supportedWallets.length}
            </p>
            {account && (
              <p style={{ overflowWrap: "anywhere" }}>
                {account.address}
              </p>
            )}
          </details>

          {message && (
            <p role="status" className="wallet-message">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
