/**
 * Convert text to an SVG string using the packaged font.
 * This implementation emits a simple SVG containing a single <text> node.
 * It does not rasterize glyphs — consumers must embed the font via CSS or
 * reference the packaged font in their app.
 *
 * @param {string} text - The text to render into SVG
 * @param {Object} [options]
 * @param {number} [options.fontSize=48]
 * @param {string} [options.color="#000"]
 * @param {string} [options.fontFamily="OpenCodeLogo"]
 * @param {number} [options.width] - svg width (optional)
 * @param {number} [options.height] - svg height (optional)
 * @param {boolean} [options.includeNamespace=true] - include SVG namespace
 * @returns {string} svg string
 */
function convertTextToSVG(text, options = {}) {
  const {
    fontSize = 48,
    color = "#000",
    fontFamily = "OpenCodeLogo",
    width,
    height,
    includeNamespace = true,
    role,
    ariaLabel
  } = options;

  const safeText = text == null ? "" : String(text);

  const ns = includeNamespace ? 'xmlns="http://www.w3.org/2000/svg"' : "";
  const wAttr = width ? ` width="${width}"` : "";
  const hAttr = height ? ` height="${height}"` : "";
  const roleAttr = role ? ` role="${role}"` : "";
  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : "";

  const svg = `<svg ${ns}${wAttr}${hAttr} viewBox="0 0 100 20"${roleAttr}${ariaAttr}>
  <text x="0" y="14" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}">${escapeXml(safeText)}</text>
</svg>`;
  return svg;
}

function escapeXml(unsafe) {
  return unsafe == null ? "" : String(unsafe).replace(/[&<>"']/g, function (c) {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
    }
  });
}

module.exports = { convertTextToSVG };

