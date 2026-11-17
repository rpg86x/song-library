# Song Library 1.0

One shared song library for all my instrument apps. Browse 81 songs in eight genres, rate them with 1 to 5 stars, preview them, and open a song straight in an instrument app to practice or listen. Works offline: no network, packages or audio files.

![Song Library](logo.png)

## Features

- **81 songs** in Children's songs, Classical, Folk & traditional, Country, Reggae style, Hip-hop style, Urban / R&B style and Pop style.
- **1–5 star ratings**, like an old-school media player. The **★★★★★** filter shows only your top songs, **★★★★+** shows 4 and 5 stars, **Rated** shows every rated song. Higher-rated songs come first.
- **Search** by title or genre.
- **▶ Preview** with a simple synthesized sound; the notes scroll along in the bar at the bottom.
- **Open in an instrument:** 🎯 Practice or 🎧 Listen opens the song in the chosen instrument app (currently [Handpan](https://github.com/rpg86x/handpan) 2.0), where the song is shifted to fit the instrument's scale.
- English (default), Dutch, German, French and Spanish.

The reggae, hip-hop, urban and pop tracks and some country tracks are originals written for these apps; well-known hits are copyrighted. All other songs are public domain.

## For instrument apps

All songs live in [`songs.js`](songs.js), which sets `window.SONG_LIBRARY`:

```js
{
  version: '1.0',
  cats: ['kids', 'classical', ...],
  songs: [[id, category, bpm, notes, original], ...], // notes in C: 'C4:2 D4 R:.5 ...' (name+octave:beats, R = rest)
  catNames: { en: {...}, nl: {...}, ... },
  names: { en: {...}, nl: {...}, ... },
}
```

An instrument app copies `songs.js` when it is built (Handpan's `android/build.ps1` does this when `song-library` sits next to `handpan`) and accepts `index.html?song=<id>&mode=practice|listen`. On Android, Song Library starts the instrument app with the intent extras `song` and `mode`. Star ratings are stored under the key `songlib.ratings`.

To add an instrument, add it to `INSTRUMENTS` in `index.html` (and to `<queries>` in `android/AndroidManifest.xml`).

## Install

**Windows:** download this repository and double-click `launch.vbs`. Put the `handpan` folder next to `song-library` so Practice and Listen can open it.

**Android:** install `Song-Library-1.0.apk` from the [latest release](https://github.com/rpg86x/song-library/releases/latest), together with the Handpan app.

## Support

If you enjoy it, you can [buy me a coffee ☕](https://urbantechmonk.gumroad.com/coffee).

## License

MIT, see [LICENSE](LICENSE).
