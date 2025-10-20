
const MATCH_URLS = [
  "*://open-exp.spotifycdn.com/cdn/build/web-player/*web-player*.js*"
];

// Optionally remove content-encoding so we receive plain text bytes.
// This helps when the server sends gzip/br compressed responses.
// Note: modifying headers may not always be possible; test it.
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    let changed = false;
    let headers = (details.responseHeaders || []).filter(h => {
      if (h.name && h.name.toLowerCase() === "content-encoding") {
        changed = true;
        return false; // drop it
      }
      return true;
    });

    if (changed) {
      return { responseHeaders: headers };
    }
    // else return undefined => no change
  },
  { urls: MATCH_URLS, types: ["script"] },
  ["blocking", "responseHeaders"]
);

// Intercept the response body and modify it on the fly.
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      // Bypass cache by forcing no-store
      browser.webRequest.handlerBehaviorChanged();

      const requestId = details.requestId;
      const filter = browser.webRequest.filterResponseData(requestId);

      const decoder = new TextDecoder("utf-8");
      const encoder = new TextEncoder();
      let chunks = [];

      filter.ondata = (event) => {
        // event.data is an ArrayBuffer
        chunks.push(event.data);
      };

      filter.onstop = (event) => {
        console.log("Intercepted:", details.url);
        try {
          // Concatenate all ArrayBuffers into one Uint8Array
          let totalLen = 0;
          for (const c of chunks) totalLen += c.byteLength;
          const tmp = new Uint8Array(totalLen);
          let offset = 0;
          for (const c of chunks) {
            tmp.set(new Uint8Array(c), offset);
            offset += c.byteLength;
          }

          // Decode to string
          let originalText = decoder.decode(tmp, { stream: false });
          let modifiedText = 'console.log("INJECTED");' + originalText;

          modifiedText = modifiedText.replace(/return this._listPlayer.setVolume\(t\).then\(this._assertOperationSuccess\)/g, "window.player1 = this; return this._listPlayer.setVolume(t).then(this._assertOperationSuccess);console.log('SMEPlayer set');");

          modifiedText = modifiedText.replace(/this._stopOnBackground=t.stopOnBackground,/g, "this._stopOnBackground=false,");
          modifiedText = modifiedText.replace(/n.current\?.isOpen/g, "true");
          modifiedText = modifiedText.replace(/n.current.isOpen/g, "true");

          modifiedText = modifiedText.replace(/this\.\_player\=n\|\|null,/g, "this._player=n||null,window.player2=this,");

          
          // --------------------------------

          // Write modified bytes back
          const outBytes = encoder.encode(modifiedText);
          filter.write(outBytes.buffer);
        } catch (err) {
          console.error("filter onstop error:", err);
          // If something goes wrong, pass the original bytes back unmodified:
          for (const c of chunks) filter.write(c);
        } finally {
          filter.disconnect(); // finish the stream
        }
      };

      filter.onerror = (e) => {
        console.error("filter error:", e);
        try { filter.disconnect(); } catch (err) { }
      };
    } catch (e) {
      console.error("Failed to create filterResponseData:", e);
    }
    // no return value — we are streaming/manipulating the response
  },
  { urls: MATCH_URLS },
  ["blocking"]
);




// const TARGET_URL_PATTERN = "*://spclient.spotify.com/storage-resolve/files/audio/interactive*";
// const AUDIO_URL_REGEX = /https:\/\/[a-zA-Z0-9\-]+\.?(?:spotifycdn\.com|scdn\.co)\/audio\/[0-9a-f]{40}(?:\?[^\s"']*)?/g;
// 
// // This is the silent MP3 (truncated for readability)
// const SILENT_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjQwLjEwMQAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAADAABgYGBgYGBgYGBgYGBgYGBggICAgICAgICAgICAgICAgICgoKCgoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDAwMDAwMDg4ODg4ODg4ODg4ODg4ODg4P////////////////////8AAAAATGF2YzU2LjYwAAAAAAAAAAAAAAAAJAAAAAAAAAAAAwDNZKlY//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZDwP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZFoP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZHgP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZJYP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"; 
// 
// browser.webRequest.onBeforeRequest.addListener(
//   (details) => {
//     const filter = browser.webRequest.filterResponseData(details.requestId);
//     const decoder = new TextDecoder("utf-8");
//     const encoder = new TextEncoder();
// 
//     let chunks = [];
// 
//     filter.ondata = event => {
//       chunks.push(event.data);
//     };
// 
//     filter.onstop = () => {
//       try {
//         const totalLength = chunks.reduce((a, b) => a + b.byteLength, 0);
//         const merged = new Uint8Array(totalLength);
//         let offset = 0;
//         for (const c of chunks) {
//           merged.set(new Uint8Array(c), offset);
//           offset += c.byteLength;
//         }
// 
//         let text = decoder.decode(merged);
// 
//         console.log("Patching Spotify Ad");
//         // Replace any matched audio URLs with the silent MP3
//         const modified = text.replace(AUDIO_URL_REGEX, SILENT_MP3);
//         
// 
//         filter.write(encoder.encode(modified));
//       } catch (err) {
//         console.error("Error modifying response:", err);
//         for (const c of chunks) filter.write(c);
//       } finally {
//         filter.disconnect();
//       }
//     };
//   },
//   { urls: [TARGET_URL_PATTERN] },
//   ["blocking"]
// );