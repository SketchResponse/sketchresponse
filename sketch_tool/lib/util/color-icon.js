// Colors an SVG icon and returns a blob url
export default function colorIcon(src, stroke, fill) {
  const div = document.createElement('div');
  div.innerHTML = src;
  const svg = div.children[0];
  svg.setAttribute('width', 35);
  svg.setAttribute('height', 35);
  svg.setAttribute('stroke', stroke);
  svg.setAttribute('fill', fill);
  // Convert colored svg to an image
  // http://www.timvasil.com/blog14/post/2014/02/06/How-to-convert-an-SVG-image-into-a-static-image-with-only-JavaScript.aspx
  // Without the charset part or it will fail in Safari
  // http://stackoverflow.com/questions/23114686/safari-image-onload-event-not-firing-with-blob-url
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  // Return the blob's URL
  return (window.URL || window.webkitURL || window).createObjectURL(blob);
}
