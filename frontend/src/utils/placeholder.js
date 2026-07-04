// Generates a reliable inline SVG placeholder image as a data URI.
// Avoids relying on dead third-party services like via.placeholder.com.

const PALETTE = ["#6c63ff", "#ff6584", "#36b37e", "#f0a500", "#3b82f6", "#e879f9"];

function colorFor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function placeholderImage(text = "Local Link", width = 300, height = 180) {
  const bg = colorFor(text);
  const label = (text || "").trim().slice(0, 22).replace(/[<&>]/g, "");
  const fontSize = Math.max(12, Math.round(width / 14));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${bg}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" fill="#ffffff"
        text-anchor="middle" dominant-baseline="middle" font-weight="700">${label}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// onError handler: swap a broken <img> to a generated placeholder once.
export function onImgError(text) {
  return (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImage(text);
  };
}
