const moments = [
  { image: "assets/motivation-mountain.svg", title: "Climb the next small step.", quote: "Progress is built one focused choice at a time.", alt: "A sunrise over a mountain trail" },
  { image: "assets/motivation-plant.svg", title: "Protect what you are growing.", quote: "The work you nurture today becomes tomorrow’s strength.", alt: "A young plant reaching toward the sun" },
  { image: "assets/motivation-rocket.svg", title: "Point your energy forward.", quote: "Momentum begins when attention has one clear destination.", alt: "A rocket launching toward the stars" },
  { image: "assets/motivation-lighthouse.svg", title: "Keep sight of your direction.", quote: "Your priorities are a lighthouse. Let them guide this moment.", alt: "A lighthouse casting a beam across the sea" },
  { image: "assets/motivation-path.svg", title: "Choose the path that matters.", quote: "A meaningful day is made from small decisions like this one.", alt: "A winding path leading through a quiet landscape" }
];

function getTargetUrl() {
  return new URLSearchParams(window.location.search).get("target") || "this site";
}

function formatHost(targetUrl) {
  try { return new URL(targetUrl).hostname; } catch { return targetUrl; }
}

document.addEventListener("DOMContentLoaded", () => {
  const moment = moments[Math.floor(Math.random() * moments.length)];
  document.getElementById("site").textContent = formatHost(getTargetUrl());
  document.getElementById("title").textContent = moment.title;
  document.getElementById("quote").textContent = moment.quote;
  const image = document.getElementById("motivation-image");
  image.src = moment.image;
  image.alt = moment.alt;
  document.getElementById("back").addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else window.close();
  });
});
