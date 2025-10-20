# Spotify Mobile Enhancer

![Mozilla Add-on Users](https://img.shields.io/amo/users/spotifymobileenhancer?label=Addon%20users) 
![Mozilla Add-on Version](https://img.shields.io/amo/v/spotifymobileenhancer?label=Version)




This extension makes use of Spotify's desktop version and re-models it back into a mobile UI. This means we get all the desktop features and are not limiting ourselfs with the mobile experience. 

Get it on [Firefox AMO for android](https://addons.mozilla.org/en-US/android/addon/spotifymobileenhancer/) and join our [Discord Server](http://discord.gg/ADHdD3MGgX) for news, help or feature requests!


Currently Working:

- Background playback
- Unlimited songs
- Any playstyle (shuffle, sequential, repeat, ...)
- Seek to any point
- Library management
- Adblock

Soon:

- Fixed media controls (lockscreen / notification buttons)


## How to use it

- Download Firefox for android and [browse here download the extension](https://addons.mozilla.org/en-US/android/addon/spotifymobileenhancer/)
- Browse to [https://open.spotify.com/](https://open.spotify.com/)
- Make sure that DRM content playback is enabled (Shield icon in the top left)
- Enable desktop mode (3 dots menu in the top right)
- Tap the screen and listen to your music!

### Tips

- If you set a homescreen shortcut, you do not need to enable desktop mode. It is like using an app.
- If playback stops after a minute, your battery settings are putting firefox to sleep. `adb shell cmd deviceidle whitelist +org.mozilla.firefox` fixes that until the next restart.
