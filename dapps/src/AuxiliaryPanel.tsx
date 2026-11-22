import { useState } from "react";

const systems = {
  Overview: ["Assembly status", "Network status"],
  Turrets: ["Turret status", "Authorized pilots", "Targeting policy"],
  Storage: ["Inventory", "Access permissions", "Storage capacity"],
  Chemistry: ["Material database", "Reaction explorer", "Production calculator", "Recipe library"],
  Energy: ["Fuel reserves", "Energy output", "Consumption rate"]
};

type Tab = keyof typeof systems;

export function AuxiliaryPanel() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <section style={{ marginTop: 24 }}>
      <nav style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 8
      }}>
        {(Object.keys(systems) as Tab[]).map(name => (
          <button
            key={name}
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            style={{
              minHeight: 56,
              fontSize: 15,
              color: tab === name ? "#63DCD6" : "#FAFAE5",
              background: tab === name ? "#25464D" : "#192830",
              border: "1px solid #30434D",
              borderRadius: 6
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <h2 style={{ color: "#63DCD6", marginTop: 24 }}>
        {tab.toUpperCase()}
      </h2>
      {systems[tab].map(item => (
        <div key={item} style={{
          background: "#192830",
          padding: 16,
          marginBottom: 8,
          borderRadius: 6
        }}>
          {item}
          <p style={{ color: "#A9BBC9" }}>
            Awaiting integration
          </p>
        </div>
      ))}
      <p style={{ color: "#A9BBC9", fontSize: 12 }}>
        AUXILIARY V0.1 - DEVELOPMENT MODE
      </p>
    </section>
  );
}
