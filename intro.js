// Refuse to run inside someone else's frame (clickjacking): GitHub Pages can't send
// frame-blocking headers, so the page hides itself if it is embedded elsewhere.
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try { window.top.location = window.self.location.href; } catch (e) {}
}
// Runs in <head> so the welcome screen is in place before the page paints.
// Shown once per browser session; skipped for reduced-motion visitors.
(function () {
  var seen = false;
  try { seen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");
  if (!seen && !still) document.documentElement.classList.add("intro");
})();
