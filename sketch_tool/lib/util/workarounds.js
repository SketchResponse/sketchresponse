// Workaround for Chrome + iOS Safari's double-tap-to-zoom behavior (at least in most cases)
// Workaround for click delay
import FastClick from 'fastclick';

const MAX_DOUBLE_TAP_DELAY = 300; // milliseconds
let lastTapTime;

export function disableDoubleTapZoom(element) {
  if (typeof window.ontouchstart === 'undefined') return;

  element.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) return;

    const currentTime = Date.now();
    if (currentTime - lastTapTime < MAX_DOUBLE_TAP_DELAY) event.preventDefault();
    lastTapTime = currentTime;
  }, false);
}

export function preventClickDelay(element) {
  FastClick.attach(element, { tapDelay: 50 }); // Cannot use tapDelay: 0 with current FastClick
}
