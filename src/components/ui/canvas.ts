/* eslint-disable no-unused-expressions -- adapted upstream snippet: the
   particle loop uses comma expressions, kept as-is to stay diffable against it. */
/**
 * Interactive cursor-trail canvas.
 *
 * Adapted from the original "Hero canvas" snippet. Changes made for this app:
 * - `renderCanvas()` returns a teardown function so the rAF loop and the
 *   document-level listeners are released when the home page unmounts
 *   (this is a react-router SPA - the hero is mounted and unmounted repeatedly).
 * - Pointer coordinates are resolved against the canvas' own bounding box
 *   instead of the viewport, so the trail tracks the cursor even though the
 *   canvas is a section-scoped element rather than a full-page overlay.
 * - The canvas is sized from its containing block (and device pixel ratio)
 *   rather than `window.innerWidth`.
 * - Honours `prefers-reduced-motion`.
 */

// @ts-ignore
function n(e) {
  // @ts-ignore
  this.init(e || {});
}
n.prototype = {
  // @ts-ignore
  init: function (e) {
    // @ts-ignore
    this.phase = e.phase || 0;
    // @ts-ignore
    this.offset = e.offset || 0;
    // @ts-ignore
    this.frequency = e.frequency || 0.001;
    // @ts-ignore
    this.amplitude = e.amplitude || 1;
  },
  update: function () {
    return (
      // @ts-ignore
      (this.phase += this.frequency),
      // @ts-ignore
      (e = this.offset + Math.sin(this.phase) * this.amplitude)
    );
  },
  value: function () {
    return e;
  },
};

// @ts-ignore
function Line(e) {
  // @ts-ignore
  this.init(e || {});
}

Line.prototype = {
  // @ts-ignore
  init: function (e) {
    // @ts-ignore
    this.spring = e.spring + 0.1 * Math.random() - 0.05;
    // @ts-ignore
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    // @ts-ignore
    this.nodes = [];
    // @ts-ignore
    for (var t, i = 0; i < E.size; i++) {
      // @ts-ignore
      t = new Node();
      // @ts-ignore
      t.x = pos.x;
      // @ts-ignore
      t.y = pos.y;
      // @ts-ignore
      this.nodes.push(t);
    }
  },
  update: function () {
    // @ts-ignore
    let e = this.spring,
      // @ts-ignore
      t = this.nodes[0];
    // @ts-ignore
    t.vx += (pos.x - t.x) * e;
    // @ts-ignore
    t.vy += (pos.y - t.y) * e;
    // @ts-ignore
    for (var i, a = 0, o = this.nodes.length; a < o; a++)
      // @ts-ignore
      (t = this.nodes[a]),
        0 < a &&
          // @ts-ignore
          ((i = this.nodes[a - 1]),
          (t.vx += (i.x - t.x) * e),
          (t.vy += (i.y - t.y) * e),
          (t.vx += i.vx * E.dampening),
          (t.vy += i.vy * E.dampening)),
        // @ts-ignore
        (t.vx *= this.friction),
        // @ts-ignore
        (t.vy *= this.friction),
        (t.x += t.vx),
        (t.y += t.vy),
        (e *= E.tension);
  },
  draw: function () {
    let e,
      t,
      // @ts-ignore
      i = this.nodes[0].x,
      // @ts-ignore
      a = this.nodes[0].y;
    // @ts-ignore
    ctx.beginPath();
    // @ts-ignore
    ctx.moveTo(i, a);
    // @ts-ignore
    for (var o = 1, s = this.nodes.length - 2; o < s; o++) {
      // @ts-ignore
      e = this.nodes[o];
      // @ts-ignore
      t = this.nodes[o + 1];
      // @ts-ignore
      i = 0.5 * (e.x + t.x);
      // @ts-ignore
      a = 0.5 * (e.y + t.y);
      // @ts-ignore
      ctx.quadraticCurveTo(e.x, e.y, i, a);
    }
    // @ts-ignore
    e = this.nodes[o];
    // @ts-ignore
    t = this.nodes[o + 1];
    // @ts-ignore
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    // @ts-ignore
    ctx.stroke();
    // @ts-ignore
    ctx.closePath();
  },
};

// @ts-ignore
function onMousemove(e) {
  function o() {
    lines = [];
    for (let e = 0; e < E.trails; e++)
      // @ts-ignore
      lines.push(new Line({ spring: 0.45 + (e / E.trails) * 0.025 }));
  }
  document.removeEventListener("mousemove", onMousemove);
  document.removeEventListener("touchstart", onMousemove);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("touchmove", onPointerMove, { passive: true });
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  onPointerMove(e);
  o();
  render();
}

/** Resolve a pointer event to coordinates in the canvas' own space. */
// @ts-ignore
function onPointerMove(e) {
  // @ts-ignore
  if (!ctx) return;
  // @ts-ignore
  const rect = ctx.canvas.getBoundingClientRect();
  const source = e.touches && e.touches.length ? e.touches[0] : e;
  // @ts-ignore
  pos.x = source.clientX - rect.left;
  // @ts-ignore
  pos.y = source.clientY - rect.top;
}

// @ts-ignore
function onTouchStart(e) {
  if (e.touches.length === 1) onPointerMove(e);
}

function render() {
  // @ts-ignore
  if (ctx && ctx.running) {
    // @ts-ignore
    ctx.globalCompositeOperation = "source-over";
    // @ts-ignore
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // @ts-ignore
    ctx.globalCompositeOperation = "lighter";
    // @ts-ignore
    ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.025)";
    // @ts-ignore
    ctx.lineWidth = 10;
    // @ts-ignore
    for (var e, t = 0; t < E.trails; t++) {
      // @ts-ignore
      (e = lines[t]).update();
      e.draw();
    }
    // @ts-ignore
    ctx.frame++;
    // @ts-ignore
    frameId = window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  // @ts-ignore
  if (!ctx) return;
  // @ts-ignore
  const canvas = ctx.canvas;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  // @ts-ignore
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

// @ts-ignore
var ctx,
  // @ts-ignore
  f,
  e = 0,
  // @ts-ignore
  frameId = 0,
  // @ts-ignore
  pos = {},
  // @ts-ignore
  lines = [],
  E = {
    debug: true,
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };

function Node() {
  // @ts-ignore
  this.x = 0;
  // @ts-ignore
  this.y = 0;
  // @ts-ignore
  this.vy = 0;
  // @ts-ignore
  this.vx = 0;
}

// @ts-ignore
function onFocus() {
  // @ts-ignore
  if (ctx && !ctx.running) {
    // @ts-ignore
    ctx.running = true;
    render();
  }
}

// @ts-ignore
function onBlur() {
  // @ts-ignore
  if (ctx) ctx.running = false;
}

/**
 * Starts the trail animation on `<canvas id={canvasId}>`.
 * Returns a teardown function - call it from the effect cleanup.
 */
export const renderCanvas = function (canvasId = "canvas"): () => void {
  const element = document.getElementById(canvasId) as HTMLCanvasElement | null;
  const noop = () => {};
  if (!element) return noop;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return noop;

  ctx = element.getContext("2d");
  if (!ctx) return noop;

  // @ts-ignore
  ctx.running = true;
  // @ts-ignore
  ctx.frame = 1;
  // @ts-ignore
  pos = { x: element.clientWidth / 2, y: element.clientHeight / 2 };
  // @ts-ignore
  f = new n({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("touchstart", onMousemove, { passive: true });
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  resizeCanvas();

  return function stopCanvas() {
    // @ts-ignore
    if (ctx) ctx.running = false;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("touchstart", onMousemove);
    document.removeEventListener("mousemove", onPointerMove);
    document.removeEventListener("touchmove", onPointerMove);
    document.removeEventListener("touchstart", onTouchStart);
    document.body.removeEventListener("orientationchange", resizeCanvas);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("blur", onBlur);
    lines = [];
    ctx = undefined;
  };
};
