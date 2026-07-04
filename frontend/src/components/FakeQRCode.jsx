import React from "react";

// Generates a deterministic, QR-code-looking pattern (NOT a real scannable QR).
// Purely visual — used to simulate a UPI payment screen.
export default function FakeQRCode({ seed = "locallink-payment", size = 200 }) {
  const grid = 21;
  const cell = size / grid;

  // Simple seeded pseudo-random generator so the pattern is stable per seed
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return (h >>> 8) / 0xffffff;
  };

  const cells = [];
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      // Leave the three corner "finder" patterns clear so it visually reads as a QR
      const inFinder =
        (r < 7 && c < 7) || (r < 7 && c > grid - 8) || (r > grid - 8 && c < 7);
      if (inFinder) continue;
      if (rand() > 0.55) cells.push([r, c]);
    }
  }

  const Finder = ({ x, y }) => (
    <g>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="#1a1a2e" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill="#1a1a2e" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "#fff", borderRadius: 12 }}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([r, c], i) => (
        <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1a1a2e" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={(grid - 7) * cell} y={0} />
      <Finder x={0} y={(grid - 7) * cell} />
    </svg>
  );
}
