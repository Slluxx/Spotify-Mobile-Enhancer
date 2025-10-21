
document.addEventListener("click", async function (event) {
  let isDesktopMode = window.matchMedia('(min-width: 800px)').matches;
  let isPWA = document.documentElement.className.includes('is-pwa');

  // Only continue if it's desktop mode OR a PWA
  if (!isDesktopMode && !isPWA) return;

  if (!document.fullscreenElement) {
    try {
      await document.body.requestFullscreen();
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
    try {
      const wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.log(`${err.name}, ${err.message}`);
    }
  }
});

document.addEventListener("dblclick", (event) => {
  let sidebar = document.querySelector("#Desktop_LeftSidebar_Id")
  if (sidebar.classList.contains("visible")) {
    sidebar.classList.remove("visible")
  } else {
    sidebar.classList.add("visible")
  }
});

// document.addEventListener("click", (event) => {
//   // a click anywhere outside of #Desktop_LeftSidebar_Id should close it.
//   let sidebar = document.querySelector("#Desktop_LeftSidebar_Id")
//   if (!sidebar.contains(event.target)) {
//     console.log(event.target)
//     sidebar.classList.remove("visible")
//   }
// });

// Create wrapper
let wrapper = document.createElement("div");
wrapper.id = "fullscreenWrapper";
wrapper.classList.add("fullscreenWrapper");
document.body.append(wrapper);

// Create fw_flex div
const fwFlex = document.createElement("div");
fwFlex.classList.add("fw_flex");
wrapper.appendChild(fwFlex);

// Create fw_content div
const fwContent = document.createElement("div");
fwContent.classList.add("fw_content");
fwFlex.appendChild(fwContent);

// Add h1
const h1 = document.createElement("h1");
h1.textContent = "Spotify Mobile Enhancer";
fwContent.appendChild(h1);

// Add first paragraph
const p1 = document.createElement("p");
p1.textContent = "If you have any issues, please visit the project's ";
const a1 = document.createElement("a");
a1.href = "https://discord.gg/ADHdD3MGgX";
a1.target = "_blank";
a1.textContent = "Discord server";
p1.appendChild(a1);
p1.appendChild(document.createTextNode("."));
fwContent.appendChild(p1);

// Add first horizontal rule
fwContent.appendChild(document.createElement("hr"));

// Add second paragraph
const p2 = document.createElement("p");
p2.textContent = "This addon ";
const b = document.createElement("b");
b.textContent = "only works in desktop mode";
p2.appendChild(b);
p2.appendChild(document.createTextNode(". Please activate it!"));
fwContent.appendChild(p2);

// Add third paragraph
const p3 = document.createElement("p");
p3.textContent = "If you have playback issues, make sure DRM content is allowed (top left, shield icon).";
fwContent.appendChild(p3);

// Add second horizontal rule
fwContent.appendChild(document.createElement("hr"));

// Add tap hint paragraph
const p4 = document.createElement("p");
p4.classList.add("tap-hint");
p4.textContent = "Press anywhere to enable fullscreen mode and proceed.";
fwContent.appendChild(p4);


async function waitForPlayerAndHook() {
  while (!window.player1) {
    await new Promise(r => setTimeout(r, 100));
  }
  console.log("SMEPlayer found");
  player1?._listPlayer?.setVolume(1)

  navigator.mediaSession.setActionHandler('pause', async (...args) => {
    // record this pause event's time
    console.log("pause called with args: ", args)
  });
}
waitForPlayerAndHook();


setInterval(async () => {
  let contentType = this.player1?._listPlayer?._currentTrack?.contentType || "music";
  let player = this.player2?._player || null;

  if (player == null) return;
  if (contentType == "music") return;

  player.currentTime = 10000;
  console.log("skip ad");
}, 100);