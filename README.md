# Song Library 1.6

One shared song library for all my instrument apps. Browse 143 songs in fourteen genres, rate them with 1 to 5 stars, preview them, and open a song straight in an instrument app to practice or listen. Works offline: no network, packages or audio files.

![Song Library](logo.png)

## Features

- **143 songs** in Children's songs, Classical, Folk & traditional, Country, Reggae style, Hip-hop style, Urban / R&B style, Pop style, West Coast style, Merseybeat style, Rock & blues style, Sea shanties, Early jazz & ragtime style and Icaro style (Amazon).
- **1–5 star ratings**, like an old-school media player. The **★★★★★** filter shows only your top songs, **★★★★+** shows 4 and 5 stars, **Rated** shows every rated song. Higher-rated songs come first.
- **Search** by title, artist/composer or genre ("dr dre", "beethoven", "still dre").
- **▶ Preview** with a simple synthesized sound; the notes scroll along in the bar at the bottom.
- **Open in an instrument:** 🎯 Practice or 🎧 Listen opens the song in the chosen instrument app (currently [Handpan](https://github.com/rpg86x/handpan) 2.3 and the kalimba in [Yoga Instruments](https://github.com/rpg86x/yoga-instruments) 1.2), where the song is shifted to fit the instrument's scale.
- English (default), Dutch, German, French and Spanish.

The reggae, hip-hop, West Coast, Merseybeat, rock & blues, urban and pop tracks and some country tracks are originals written for these apps; well-known hits are copyrighted. All other songs are public domain.

## What's new in 1.6

- **Icaro style (Amazon):** 10 calm, repetitive original songs inspired by the healing songs of the Amazon (Canto del Río, Selva de Noche, Agua Clara, Luz de Luna and more), with a soft rattle rhythm when you listen.
- Real icaros are sacred songs passed on orally by the Shipibo-Konibo and mestizo healers; they are not transcribed here. Two reference cards link to recordings of traditional icaros instead. The originals are meant for relaxation and practice, not as ceremonial songs.

## What's new in 1.5

- **Kalimba** as a second instrument: choose it under *Play on* and Practice/Listen opens the song on the 17-tine kalimba in Yoga Instruments 1.2.

## What's new in 1.4

- **More classical music from before 1930:** Tchaikovsky's Swan Lake (theme) and Grieg's Morning Mood (Peer Gynt).
- **Sea shanties:** My Bonnie Lies Over the Ocean (traditional) plus 9 originals in shanty style.
- **Early jazz & ragtime style:** 10 originals with a swing feel (in the style of Scott Joplin, Jelly Roll Morton, Louis Armstrong). Real ragtime is full of chromatic notes that do not fit a 9-note handpan, so these are written for these apps.

## What's new in 1.3

- **Merseybeat style** (in the style of The Beatles, The Hollies, Gerry & the Pacemakers) and **Rock & blues style** (in the style of The Rolling Stones, The Kinks, The Animals): 10 original tunes each.
- **Reference songs:** 10 Beatles songs and 10 Rolling Stones songs, searchable on "beatles" or "stones", with a YouTube link (copyrighted, not playable).
- Search now looks through the whole library, whatever filter is selected.

## What's new in 1.2

- **Artist search:** every song shows its artist or composer (or Traditional / Song Library original), and you can search on it. Style series list the artists whose style they follow (West Coast: Dr. Dre, Snoop Dogg, Warren G).
- **Reference songs:** well-known tracks (for now 10 Dr. Dre songs, including Still D.R.E.) appear as reference cards with a YouTube link. They are copyrighted, so they are not playable in the apps.

## What's new in 1.1

- **West Coast style:** 10 original tunes in a laid-back G-funk feel (minor riffs, lazy tempo around 86–96 bpm): Sunset Cruise, Hydraulic Bounce, Palm Trees & Bass, Whistle Lead, Chrome Rims, Boulevard Nights, Coastline Drive, Laid Back Bounce, Talkbox Hook and City Haze. They are written for these apps and are not covers of existing songs.

## For instrument apps

All songs live in [`songs.js`](songs.js), which sets `window.SONG_LIBRARY`:

```js
{
  version: '1.0',
  cats: ['kids', 'classical', ...],
  songs: [[id, category, bpm, notes, original], ...], // notes in C: 'C4:2 D4 R:.5 ...' (name+octave:beats, R = rest)
  artists: { id: name, ... },   // composer/artist; missing = traditional
  like: { cat: 'artists' },    // artists whose style a series follows
  refs: [[title, artist, year, category], ...], // reference only, not playable
  catNames: { en: {...}, nl: {...}, ... },
  names: { en: {...}, nl: {...}, ... },
}
```

An instrument app copies `songs.js` when it is built (Handpan's `android/build.ps1` does this when `song-library` sits next to `handpan`) and accepts `index.html?song=<id>&mode=practice|listen`. On Android, Song Library starts the instrument app with the intent extras `song` and `mode`. Star ratings are stored under the key `songlib.ratings`.

To add an instrument, add it to `INSTRUMENTS` in `index.html` (and to `<queries>` in `android/AndroidManifest.xml`).

## Install

**Windows:** download this repository and double-click `launch.vbs`. Put the `handpan` folder next to `song-library` so Practice and Listen can open it.

**Android:** install `Song-Library-1.6.apk` from the [latest release](https://github.com/rpg86x/song-library/releases/latest), together with the Handpan app.

## Support

If you enjoy it, you can [buy me a coffee ☕](https://urbantechmonk.gumroad.com/coffee).

## License

MIT, see [LICENSE](LICENSE).
