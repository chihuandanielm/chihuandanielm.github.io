// Songs from Daniel's playlist. Add or remove track IDs here.
const TRACKS = [
  "2bY66Hf5NbHJ8Ai8eNmJHG",
  "6Np34OlXWv1CQrWeS2vDDf",
  "66lzMLzjOTyUifukUQijgi",
  "6wyjGiFFJMNxFyY4h0ttYY",
  "6ZfbRzC0HfmjDnpXQPXY6T",
  "6nQ5BgxkRV5adJWZ5J3yhO",
  "5uM2TbV57PabdmqUTJa1pG",
  "2T43AxusLnjIbGGG1kiPPW",
  "6wdWtY9TSHJkJcqrZYXszh",
  "0e2lVYFeMmWa5jD1cVwRCD",
  "15ouqiBsgL12olEwP3COsH",
  "7yJnLTNfgHiZ0UeVggGFfM",
  "0l2k4tdemioYYKIDtEv21c",
  "3a6PN6BRB8PP3ms48s7kU1",
  "4ZNYJOxZ1Sy31bONMhaxJo",
  "7e3BbVSFHrB6aa96DI51B3",
  "6gdTVZdQcVN54ynCk38l5U",
  "4NaIl2XLSgc5AoFIZm1NIU",
  "4R4ibcuHCHEpKBztwwaWA5",
  "4wBdGRxCaWFtqei59k5InB",
  "643gyipSU7dkmrFhJ8UAIm",
  "51SEkcIzdhHMwJkPkMmRzd",
  "1qqTuxNccTQnQdkCEog6Ij",
  "6bBobm1wePzB1WG7FD68zd",
  "6rH7FNJbSSTUc3VtzBBLkt",
  "0lqbe22EgZLN6G2HWaGaIu",
  "1xGt3Np5IvsHQji0RguBLE",
  "7Jq4cV3F5puQfUAxL4sHL8",
  "6FaJAAYa9H2jPIvjXDIdH0",
  "4OAGNHmLQJfxm1dJNRI3mZ",
  "05uSGDvQK7ZZyBDgnP9npg",
  "6yMy5joCgj77h9DAjgm1ye",
  "0OMNQyneWmmZtTQpULYJcl",
  "0eDVClItJH4PkfPu7dciKP",
  "499ED0dvqypAvFR2agwuoz",
  "0LS3cTpTm5zPTmBcyIDfOJ",
  "1OH4jBRyZTIyHh746XWvPO",
  "3Mbkhd9tdMwyqbrVE3IODX",
  "0SwjbQm2kxPScZSwgMiKEr",
  "0EjtZmOLT6WLShJRHCFWVU",
];

// Shuffle the songs once per visit, then step through them with "next song".
const order = TRACKS.slice();
for (let i = order.length - 1; i > 0; i--) {
  const k = Math.floor(Math.random() * (i + 1));
  [order[i], order[k]] = [order[k], order[i]];
}
let pos = 0;
const player = document.getElementById("spotify");
function play(n) {
  const id = order[n % order.length];
  if (/^[A-Za-z0-9]{22}$/.test(id)) {
    player.src = "https://open.spotify.com/embed/track/" + id + "?theme=0";
  }
}
play(pos);
document.getElementById("next").addEventListener("click", () => play(++pos));

// Highlight the tab for the section in view.
const tabs = document.querySelectorAll(".nav a");
const watch = { looking: "about", experience: "project" };
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const id = watch[e.target.id] || e.target.id;
    tabs.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  }
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("section[id]").forEach((s) => io.observe(s));

const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Resume: drag to spin, tap to open (it inks in) ----------
const lightbox = document.getElementById("lightbox");
const card = document.getElementById("card");
if (card && lightbox) {
  let rx = 6, ry = -18, vy = 0, dragging = false, moved = 0, lastX = 0, lastY = 0, t = 0;
  const draw = () => {
    card.style.setProperty("--rx", rx + "deg");
    card.style.setProperty("--ry", ry + "deg");
  };
  const loop = () => {
    if (!dragging) {
      if (Math.abs(vy) > 0.05) { ry += vy; vy *= 0.94; }       // momentum after a flick
      else if (!still) { t += 0.012; ry += Math.sin(t) * 0.08; } // gentle idle sway
      rx += (6 - rx) * 0.04;
      draw();
    }
    requestAnimationFrame(loop);
  };
  card.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; vy = 0;
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    ry += dx * 0.5; vy = dx * 0.5;
    rx = Math.max(-30, Math.min(30, rx - dy * 0.3));
    lastX = e.clientX; lastY = e.clientY;
    draw();
  });
  card.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6) lightbox.showModal();
  });
  card.addEventListener("pointercancel", () => { dragging = false; });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lightbox.showModal(); }
  });
  document.getElementById("lb-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
  draw();
  requestAnimationFrame(loop);
}

// drawings: no right-click save or drag-out
document.querySelectorAll(".art-img").forEach((im) => im.addEventListener("contextmenu", (e) => e.preventDefault()));

// ---------- ink wash: a watercolor-edged pool of ink, drawn on a canvas ----------
// A single ragged polygon per frame is cheap on phones (the old SVG noise filter was not).
const fx = document.getElementById("fx");
const ink = document.getElementById("ink");
const ictx = ink.getContext("2d");
const fxTitle = fx.querySelector(".fx-title");
const INK = "#111116";
const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const diag = () => Math.hypot(innerWidth, innerHeight);
let dpr = 1;
function sizeInk() {
  dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.75);
  ink.width = Math.round(innerWidth * dpr);
  ink.height = Math.round(innerHeight * dpr);
  ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeInk();
addEventListener("resize", sizeInk);
// ragged edge: a few layered sine waves around the circle, drifting slowly as it grows
const P = [Math.random() * 6, Math.random() * 6, Math.random() * 6];
function blob(x, y, r, wob) {
  const N = innerWidth < 760 ? 90 : 140, pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k = 1 + .06 * Math.sin(5 * a + P[0] + wob) + .035 * Math.sin(9 * a + P[1] - wob * 1.3)
                + .018 * Math.sin(17 * a + P[2] + wob * .7) + .008 * Math.sin(31 * a + P[0] * 2 - wob);
    pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]);
  }
  // smooth curve through midpoints, so the edge reads as pigment, not a polygon
  ictx.beginPath();
  const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let s = m(pts[N - 1], pts[0]);
  ictx.moveTo(s[0], s[1]);
  for (let i = 0; i < N; i++) {
    const p = pts[i], e = m(p, pts[(i + 1) % N]);
    ictx.quadraticCurveTo(p[0], p[1], e[0], e[1]);
  }
  ictx.closePath();
  ictx.fill();
}
// soft, bleeding edge: faint washes that widen outward, then the solid body
const RINGS = innerWidth < 760 ? [[16, .1, .8], [7, .22, .4], [2, .4, .15]] : [[22, .07, .9], [14, .12, .6], [8, .2, .35], [3, .38, .15]];
function softBlob(x, y, r, wob) {
  if (r <= 0) return;
  for (const [pad, alpha, shift] of RINGS) { ictx.globalAlpha = alpha; blob(x, y, r + pad * (1 + r / 900), wob + shift); }
  ictx.globalAlpha = 1;
  blob(x, y, r, wob);
}
function clearInk() { ictx.clearRect(0, 0, innerWidth, innerHeight); }
function cover() {
  clearInk();
  ictx.globalCompositeOperation = "source-over";
  ictx.fillStyle = INK;
  ictx.fillRect(0, 0, innerWidth, innerHeight);
}
function tween(ms, step, curve = ease) {
  return new Promise((done) => {
    const t0 = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      const finished = step(Math.max(0, Math.min(1, curve(t))), t);
      t < 1 && !finished ? requestAnimationFrame(frame) : done();
    };
    requestAnimationFrame(frame);
  });
}
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
// the blob's narrowest point is ~0.88 of its radius; past this it covers every corner
const MIN_K = 0.88;
function farthestCorner(x, y) {
  return Math.max(Math.hypot(x, y), Math.hypot(innerWidth - x, y), Math.hypot(x, innerHeight - y), Math.hypot(innerWidth - x, innerHeight - y));
}
// "spread": ink blooms out from (x, y) until it covers the screen
function spread(x, y, ms) {
  const need = farthestCorner(x, y) / MIN_K + 4, R = need * 1.05;
  return tween(ms, (k, t) => {
    clearInk();
    ictx.globalCompositeOperation = "source-over";
    ictx.fillStyle = INK;
    softBlob(x, y, R * k, t * 2);
    return R * k >= need;
  }, easeInOutSine).then(cover);
}
// "open": a hole blooms open from the centre, revealing the page beneath
function open(ms) {
  const x = innerWidth / 2, y = innerHeight / 2;
  const need = farthestCorner(x, y) / MIN_K + 30, R = need * 1.05;   // +30 clears the soft outer washes too
  return tween(ms, (k, t) => {
    cover();
    ictx.globalCompositeOperation = "destination-out";
    softBlob(x, y, R * k, t * 2);
    ictx.globalCompositeOperation = "source-over";
    return R * k >= need;
  }, easeInOutSine).then(clearInk);
}
// let the browser paint once (e.g. after a big scroll or DOM change) before animating
const nextPaint = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
let busy = false;
function jumpTo(el) {
  const root = document.documentElement, prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const navH = document.querySelector(".nav").offsetHeight;
  window.scrollTo(0, el.getBoundingClientRect().top + scrollY - navH);
  root.style.scrollBehavior = prev;
}

// ---------- Evangelion-style title card when a tab is clicked ----------
[...tabs, ...document.querySelectorAll(".land-btn")].forEach((a) => a.addEventListener("click", async (e) => {
  const target = document.querySelector(a.getAttribute("href"));
  if (!target || still || busy) return;
  e.preventDefault();
  busy = true;
  fx.classList.add("on", "block");
  fxTitle.querySelector("span").textContent = a.textContent;
  await spread(e.clientX, e.clientY, 420);
  fxTitle.classList.add("on");
  await fxTitle.animate([{ opacity: 0, transform: "scale(1.03)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out", fill: "forwards" }).finished;
  jumpTo(target);
  // the landing section (and the one after) are already drawn when the ink opens
  [target, target.nextElementSibling, target.nextElementSibling?.nextElementSibling]
    .filter((s) => s && s.classList?.contains("sec")).forEach((s) => revealSection(s, true));
  history.replaceState(null, "", a.getAttribute("href"));
  await new Promise((r) => setTimeout(r, 240));
  await nextPaint();
  fxTitle.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
  await open(460);
  fxTitle.classList.remove("on");
  fx.classList.remove("on", "block");
  busy = false;
}));

let revealSection = () => {};

// ---------- while scrolling: drafting lines, sigils, ink-in, blooms ----------
const NS = "http://www.w3.org/2000/svg";
function el(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent.appendChild(n);
  return n;
}
// construction lines along the top of a section: a rule with ticks, a compass arc and a datum circle
function draft(sec) {
  const w = sec.clientWidth;
  const svg = el("svg", { class: "draft", viewBox: `0 0 ${w} 150`, "aria-hidden": "true" }, sec);
  const L = w * 0.04, R = w * 0.96, y = 26;
  const parts = [
    el("path", { d: `M${L} ${y} H${R}`, pathLength: 1 }, svg),
    el("path", { d: [...Array(11)].map((_, i) => { const x = L + (R - L) * i / 10; return `M${x} ${y - (i % 5 ? 4 : 9)} V${y + (i % 5 ? 4 : 9)}`; }).join(" "), pathLength: 1 }, svg),
    el("path", { d: `M${L + 18} ${y} V${y + 110}`, pathLength: 1, class: "faint" }, svg),
    el("path", { d: `M${R - 120} ${y} A 120 120 0 0 0 ${R} ${y + 120}`, pathLength: 1, class: "faint" }, svg),
    el("circle", { cx: L + 18, cy: y + 110, r: 7, pathLength: 1 }, svg),
    el("path", { d: `M${L + 6} ${y + 110} H${L + 30} M${L + 18} ${y + 98} V${y + 122}`, pathLength: 1 }, svg),
  ];
  const label = el("text", { x: R - 4, y: y - 10, "text-anchor": "end" }, svg);
  label.textContent = (sec.id || "").toUpperCase() + "  \u2014  1:1";
  parts.push(label);
  return parts;
}
document.querySelectorAll(".sec h2").forEach((h) => {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("class", "h-sigil"); s.setAttribute("viewBox", "0 0 240 120"); s.setAttribute("aria-hidden", "true");
  el("use", { href: "#sigil" }, s);
  h.appendChild(s);
});
// the sigil <use> needs real paths to animate, so clone the symbol's children in
document.querySelectorAll(".h-sigil, .fx-sigil").forEach((s) => {
  const src = document.getElementById("sigil");
  s.innerHTML = "";
  [...src.children].forEach((c) => { const k = c.cloneNode(); k.setAttribute("pathLength", 1); s.appendChild(k); });
});
const flowers = [...document.querySelectorAll(".fl")];
if (still || !("IntersectionObserver" in window)) {
  flowers.forEach((f) => f.classList.add("open"));
  document.querySelectorAll(".sec").forEach((s) => s.classList.add("ink-static"));
} else {
  revealSection = (s, now) => {
    if (!s.classList.contains("ink-wait")) return;
    seen.unobserve(s);
    if (now) s.classList.add("ink-now");
    s.classList.remove("ink-wait");
    s.classList.add("ink-in");
    if (now) requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove("ink-now")));
    const wait = now ? 250 : 0;
    draft(s).forEach((p, i) => setTimeout(() => p.classList.add("go"), wait + i * 120));
  };
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) revealSection(e.target, false);
  }, { rootMargin: "0px 0px -18% 0px" });
  document.querySelectorAll(".sec").forEach((s) => { s.classList.add("ink-wait"); seen.observe(s); });
  const bloom = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("open"); bloom.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px" });
  flowers.forEach((f) => bloom.observe(f));
  // blooms drift a little slower than the page, like they sit on a deeper layer (desktop only)
  let ticking = false;
  if (matchMedia("(hover: hover) and (min-width: 761px)").matches) addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      flowers.forEach((f, i) => {
        const r = f.getBoundingClientRect();
        const off = (r.top + r.height / 2 - innerHeight / 2) * (0.06 + (i % 3) * 0.03);
        f.style.translate = `0 ${off.toFixed(1)}px`;
      });
      ticking = false;
    });
  }, { passive: true });
}

// ---------- Mahogany doors swing open onto each drawing as the gallery comes into view ----------
const pieces = [...document.querySelectorAll(".piece")];
if (still || !("IntersectionObserver" in window)) {
  pieces.forEach((p) => p.classList.add("open"));
} else {
  const doors = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      doors.unobserve(e.target);
      setTimeout(() => e.target.classList.add("open"), 1100 + pieces.indexOf(e.target) * 380);
    }
  }, { threshold: 0.45 });
  pieces.forEach((p) => doors.observe(p));
}

// ---------- Toby: a small photo in About that opens into a gallery ----------
const tobyBox = document.getElementById("toby-box");
const tbGrid = document.getElementById("tb-grid");
const tbStage = document.getElementById("tb-stage");
const tbImg = document.getElementById("tb-img");
const tbName = document.getElementById("tb-name");
const tbHint = document.getElementById("tb-hint");
const tbPics = [...tbGrid.querySelectorAll(".tb-pic")];
let tbAt = 0;
function tbShow(i) {
  tbAt = (i + tbPics.length) % tbPics.length;
  const im = tbPics[tbAt].querySelector("img");
  tbImg.src = im.src; tbImg.alt = im.alt;
  tbName.textContent = tbPics[tbAt].querySelector(".titlebar span").textContent;
  tbGrid.hidden = true; tbStage.hidden = false;
  tbHint.textContent = "Photo " + (tbAt + 1) + " of " + tbPics.length + ". Use the arrows or your arrow keys.";
  if (!tbStage.contains(document.activeElement)) document.getElementById("tb-next").focus({ preventScroll: true });
}
function tbGridView() {
  tbStage.hidden = true; tbGrid.hidden = false;
  if (tobyBox.open) tbPics[tbAt].focus({ preventScroll: true });
  tbHint.textContent = "Click a photo to enlarge it.";
}
document.getElementById("toby-open").addEventListener("click", () => { tbGridView(); tobyBox.showModal(); });
tbPics.forEach((b, i) => b.addEventListener("click", () => tbShow(i)));
document.getElementById("tb-prev").addEventListener("click", () => tbShow(tbAt - 1));
document.getElementById("tb-next").addEventListener("click", () => tbShow(tbAt + 1));
document.getElementById("tb-all").addEventListener("click", tbGridView);
document.getElementById("tb-close").addEventListener("click", () => tobyBox.close());
tobyBox.addEventListener("click", (e) => { if (e.target === tobyBox) tobyBox.close(); });
document.addEventListener("keydown", (e) => {
  if (!tobyBox.open || tbStage.hidden) return;
  if (e.key === "ArrowLeft") tbShow(tbAt - 1);
  if (e.key === "ArrowRight") tbShow(tbAt + 1);
});

// ---------- Contact quick-fill: email endings and ready-made messages ----------
const emailBox = document.getElementById("email");
const msgBox = document.getElementById("message");
const quickStatus = document.getElementById("quick-status");
function flash(btn, text) {
  btn.classList.add("done");
  setTimeout(() => btn.classList.remove("done"), 1200);
  quickStatus.textContent = text;
}
document.querySelectorAll(".qbtn.dom").forEach((btn) => btn.addEventListener("click", () => {
  const name = emailBox.value.trim().split("@")[0];            // keep what they typed, swap the ending
  emailBox.value = name + "@" + btn.dataset.domain;
  emailBox.focus();
  if (!name) emailBox.setSelectionRange(0, 0);                 // cursor ready for their name
  else emailBox.setSelectionRange(emailBox.value.length, emailBox.value.length);
  flash(btn, name ? "Email ending added." : "Ending added. Now type your name before the @.");
}));
document.querySelectorAll(".qbtn.msg").forEach((btn) => btn.addEventListener("click", () => {
  msgBox.value = btn.dataset.text;
  msgBox.focus();
  const pick = btn.dataset.select;
  if (pick) {                                                  // select the first blank so typing replaces it
    const i = msgBox.value.indexOf(pick);
    msgBox.setSelectionRange(i, i + pick.length);
    flash(btn, "Message written. Type to replace the highlighted [your name].");
  } else {
    msgBox.setSelectionRange(msgBox.value.length, msgBox.value.length);
    flash(btn, "Message written. Add anything else you like, then press Send.");
  }
}));

// ---------- Landing: links, scroll cue, and tiles orbiting the name like Wii channels ----------
const landing = document.getElementById("home");
const field = document.getElementById("float-field");
const core = document.getElementById("land-core");
const cue = document.getElementById("land-cue");
const tiles = [...field.querySelectorAll(".ft")];
const navEl = document.getElementById("nav");
tiles.forEach((t) => { if (t.dataset.cols) t.style.setProperty("--cols", t.dataset.cols); });
cue.addEventListener("click", (e) => {
  e.preventDefault();
  const t = document.getElementById("start");
  scrollTo({ top: t.getBoundingClientRect().top + scrollY - navEl.offsetHeight, behavior: still ? "auto" : "smooth" });
});

// Each tile gets its own elliptical orbit around the name, just wide enough that no point of its lap
// touches the name or buttons. All tiles turn together at one slow speed with even spacing, and a full
// lap is simulated up front so any tile that would ever bump another is left out.
let orbit = null;
let simT = 0, lastF = 0, running = false, visibleL = true;
function layoutTiles() {
  const W = landing.clientWidth, H = landing.clientHeight, mobile = W < 761;
  const L = landing.getBoundingClientRect(), r = core.getBoundingClientRect();
  const pad = mobile ? 12 : 28;
  const cb = { x: r.left - L.left - pad, y: r.top - L.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
  const pr = document.getElementById("land-priv").getBoundingClientRect();
  const pb = { x: pr.left - L.left - 12, y: pr.top - L.top - 12, w: pr.width + 24, h: pr.height + 24 };
  const cx = cb.x + cb.w / 2, cy = cb.y + cb.h / 2;
  const s = mobile ? Math.max(.5, Math.min(.6, W / 650)) : Math.max(.66, Math.min(.92, W / 1560));
  // desktop: the lap stays on screen; phones: a wide, flat lap that sweeps above and below the name
  // and slips off the sides of the screen
  const rx = mobile ? W * .95 : W / 2 - 52 * s, ry = mobile ? H / 2 - 58 : H / 2 - 50 * s;
  const kMax = mobile ? 1.12 : 1.0;
  const hit = (a, b, m = 0) => a.x < b.x + b.w - m && b.x < a.x + a.w - m && a.y < b.y + b.h - m && b.y < a.y + a.h - m;
  const at = (it, ang) => ({ x: cx + rx * it.k * Math.cos(ang) - it.w / 2, y: cy + ry * it.k * Math.sin(ang) - it.h / 2, w: it.w, h: it.h });
  let items = [];
  // short screens: shrink tiles and let the lap run a little past the edges until enough fit
  for (const [kTop, sm] of [[kMax, 1], [kMax + .1, .86], [kMax + .2, .74]]) {
  items = [];
  tiles.forEach((t, i) => {
    const it = { el: t, pri: i, w: +t.dataset.w * s * sm, h: +t.dataset.h * s * sm + (t.querySelector(".fw") ? 12 : 0) };
    for (let k = .4; k <= kTop; k += .02) {
      it.k = k;
      let ok = true;
      for (let a = 0; a < 6.283 && ok; a += .04) { const q = at(it, a); ok = !hit(q, cb) && !hit(q, pb); }
      if (ok) {
        // stagger orbits for depth, but only as far out as the lap stays clear
        const base = k;
        for (let kk = Math.min(kTop, base + .04 + (i % 3) * .05); kk > base; kk -= .02) {
          it.k = kk; let clear = true;
          for (let a2 = 0; a2 < 6.283 && clear; a2 += .04) { const q = at(it, a2); clear = !hit(q, cb) && !hit(q, pb); }
          if (clear) break;
          it.k = base;
        }
        items.push(it); break;
      }
    }
  });
  if (items.length >= (mobile ? 6 : 9)) break;
  }
  items = items.slice(0, mobile ? 10 : 14);
  // spread evenly, then drop the lowest-priority tile of any pair that would collide during a lap
  for (;;) {
    const n = items.length;
    items.forEach((it, i) => { it.a0 = (i / n) * Math.PI * 2 + .3; });
    let worst = null;
    for (let a = 0; a < 6.283 && !worst; a += .06) {
      const rects = items.map((it) => at(it, it.a0 + a));
      for (let i = 0; i < n && !worst; i++) for (let k2 = i + 1; k2 < n; k2++) {
        if (hit(rects[i], rects[k2], -(mobile ? 8 : 16))) { worst = items[i].pri > items[k2].pri ? items[i] : items[k2]; break; }
      }
    }
    if (!worst) break;
    items = items.filter((it) => it !== worst);
  }
  tiles.forEach((t) => t.classList.remove("on"));
  items.forEach((it, i) => {
    const t = it.el;
    t.style.setProperty("--w", it.w + "px");
    t.style.setProperty("--op", (t.querySelector(".fa, .fs, .fseal") ? .88 : it.k > 1 ? .62 : .78).toFixed(2));
    t.style.setProperty("--in", (.25 + i * .07).toFixed(2) + "s");
    t.style.zIndex = Math.round(10 - it.k * 4);
    t.classList.add("on");
    it.ph = i * 1.7; it.rot = ((i % 3) - 1) * 1.5;
  });
  orbit = { cx, cy, rx, ry, speed: 1 / 150, bodies: items };
  render(simT);
}
function render(t) {
  if (!orbit) return;
  const { cx, cy, rx, ry, speed } = orbit;
  const turn = t * speed * Math.PI * 2;
  for (const b of orbit.bodies) {
    const a = b.a0 + turn;
    const breathe = 1 + .015 * Math.sin(t * .45 + b.ph);            // a slow in-and-out, like breathing
    const x = cx + rx * b.k * breathe * Math.cos(a) - b.w / 2;
    const y = cy + ry * b.k * breathe * Math.sin(a) - b.h / 2 + 4 * Math.sin(t * .8 + b.ph);
    const rot = b.rot + 1.4 * Math.sin(t * .5 + b.ph);
    b.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
  }
}
function frame(now) {
  if (!running) return;
  simT += Math.min(1 / 20, (now - (lastF || now)) / 1000);
  lastF = now;
  render(simT);
  requestAnimationFrame(frame);
}
function startSim() {
  if (running || still || !orbit || !visibleL || document.hidden) return;
  running = true; lastF = 0; requestAnimationFrame(frame);
}
function stopSim() { running = false; }
document.addEventListener("visibilitychange", () => (document.hidden ? stopSim() : startSim()));
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => {
    visibleL = e.isIntersecting;
    landing.classList.toggle("paused", !visibleL);
    visibleL ? startSim() : stopSim();
  }).observe(landing);
}
let landed = false;
function landingIn() {
  if (landed) return;
  landed = true;
  layoutTiles();
  requestAnimationFrame(() => { landing.classList.remove("land-pre"); startSim(); });
}
let rz, lastW = innerWidth;
addEventListener("resize", () => {
  clearTimeout(rz);
  rz = setTimeout(() => {
    measure();
    // phones resize the viewport when the address bar slides; only re-lay out on a real width change
    if (landed && (innerWidth !== lastW || !orbit)) { lastW = innerWidth; layoutTiles(); }
    onScroll();
  }, 180);
});

// ---------- Leaving the landing: the screen dims into a textured dusk, then lifts onto the site ----------
const dusk = document.getElementById("dusk");
const duskRule = dusk.querySelector(".dusk-rule");
const duskTag = dusk.querySelector(".dusk-tag");
let inSite = null, landBottom = 0, gapH = 0;
const gapEl = document.getElementById("dusk-gap");
function measure() { landBottom = landing.offsetTop + landing.offsetHeight; gapH = gapEl.offsetHeight; }
measure();
// the dusk glides toward the scroll position instead of jumping with each wheel notch
let duskTarget = 0, duskNow = 0, duskRun = false, duskLast = 0;
function duskPaint(p) {
  if (p > .002) {
    dusk.style.visibility = "visible";
    dusk.style.opacity = (p * .86).toFixed(4);
    duskRule.style.transform = `scaleX(${smooth(p * 1.3).toFixed(4)})`;
    duskTag.style.opacity = smooth((p - .55) / .4).toFixed(4);
  } else if (dusk.style.visibility !== "hidden") {
    dusk.style.visibility = "hidden";
    dusk.style.opacity = "0";
  }
}
function duskFrame(now) {
  const dt = duskLast ? Math.min(.05, (now - duskLast) / 1000) : 1 / 60;
  duskLast = now;
  duskNow += (duskTarget - duskNow) * (1 - Math.exp(-dt * 6));      // ~170ms to catch up, frame-rate independent
  if (Math.abs(duskTarget - duskNow) < .0015) duskNow = duskTarget;
  duskPaint(duskNow);
  if (duskNow !== duskTarget) requestAnimationFrame(duskFrame);
  else duskRun = false;
}
const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
function onScroll() {
  const H = innerHeight, d = landBottom - scrollY;               // where the landing's bottom edge sits on screen
  const nav = navEl.offsetHeight;
  // darkens while the landing leaves, holds briefly, lifts as the site reaches the top
  const p = still ? 0 : smooth((H * .92 - d) / (H * .42)) * smooth((d + gapH - nav) / (H * .38));
  duskTarget = p;
  if (!duskRun) { duskRun = true; duskLast = 0; requestAnimationFrame(duskFrame); }
  // the scroll cue has done its job once scrolling starts
  if (scrollY > 2) { cue.style.transition = "none"; cue.style.opacity = Math.max(0, 1 - scrollY / (H * .22)).toFixed(3); }
  else if (cue.style.opacity !== "") { cue.style.opacity = ""; }
  const now = d < H * .4;
  if (now !== inSite) { inSite = now; navEl.classList.toggle("show", now); }
}
let sTick = false;
addEventListener("scroll", () => {
  if (sTick) return;
  sTick = true;
  requestAnimationFrame(() => { sTick = false; onScroll(); });
}, { passive: true });
onScroll();

// ---------- Privacy corner tag: jump to the footer and open the details ----------
document.getElementById("land-priv").addEventListener("click", (e) => {
  const d = document.getElementById("privacy");
  if (!d) return;
  e.preventDefault();
  d.open = true;
  const y = d.getBoundingClientRect().top + scrollY - navEl.offsetHeight - 24;
  scrollTo({ top: y, behavior: still ? "auto" : "smooth" });
  history.replaceState(null, "", "#privacy");
  // sections reveal as the page passes them, which can shift the footer; settle on it once the scroll stops
  let t, last = -1;
  const settle = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const top = d.getBoundingClientRect().top - navEl.offsetHeight - 24;
      if (Math.abs(top) > 4 && scrollY !== last) { last = scrollY; scrollTo({ top: scrollY + top, behavior: "auto" }); }
      removeEventListener("scroll", settle);
    }, 160);
  };
  addEventListener("scroll", settle, { passive: true });
});

// ---------- Welcome: ink, Toby walks the drafting line, then the ink opens onto the site ----------
const intro = document.getElementById("intro");
if (document.documentElement.classList.contains("intro")) {
  const steps = document.getElementById("steps");
  const pug = intro.querySelector(".pug");
  const walk = intro.querySelector(".walk");
  const printer = setInterval(() => {
    const x = pug.getBoundingClientRect().left - walk.getBoundingClientRect().left;
    const p = document.createElement("span");
    p.textContent = "\u2234";
    p.style.left = Math.max(0, x + pug.offsetWidth * 0.2) + "px";
    steps.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }, 180);
  const type = document.getElementById("type");
  [..."Welcome"].forEach((ch, i) => setTimeout(() => { type.textContent += ch; }, 650 + i * 75));
  let done = false;
  const finish = async () => {
    if (done) return;
    done = true;
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    clearInterval(printer);
    // the welcome screen simply fades away onto the page, and the landing settles in beneath it
    intro.classList.add("fade");
    setTimeout(landingIn, 220);
    await new Promise((r) => setTimeout(r, 700));
    document.documentElement.classList.remove("intro");
    intro.remove();
  };
  setTimeout(finish, 2000);
  intro.addEventListener("click", finish);
  addEventListener("keydown", finish, { once: true });
} else {
  if (intro) intro.remove();
  requestAnimationFrame(landingIn);
}
