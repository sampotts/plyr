# Captions

Plyr renders [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) caption/subtitle tracks. Beyond the standard
`<track>` elements you declare in your HTML, Plyr can:

- add tracks **programmatically** from inline text or a URL, and
- let the **user upload** their own caption file from their device.

Plyr intentionally ships **no subtitle parser**, so it has **no runtime dependencies** for this feature. Anything that isn't already
WebVTT (SRT, SSA/ASS, SUB, …) is converted by a small `process` hook that _you_ provide, using whichever library you prefer
(e.g. [subsrt](https://github.com/papnkukn/subsrt), [subtitle](https://github.com/gsantiago/subtitle)).

## Adding a track programmatically

Use the [`addCaptionTrack`](#playeraddcaptiontrackoptions) method to inject a track at any time after setup. You can provide either
inline WebVTT `text` or a `src`/`url` pointing at a track file:

```js
// From inline WebVTT text
player.addCaptionTrack({
  text: 'WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nHello there!',
  label: 'English (custom)',
  srclang: 'en',
});

// From a URL
player.addCaptionTrack({
  url: 'https://example.com/captions.fr.vtt',
  label: 'Français',
  srclang: 'fr',
});
```

The menu is refreshed automatically so the new track becomes selectable, even when [`captions.update`](README.md#options) is `false`.

## Letting users upload captions

Enable uploads to add an **"Upload captions"** entry to the captions settings menu. Selecting it opens a file picker; the chosen file is
read and added as a track.

```js
const player = new Plyr('#player', {
  captions: {
    active: true,
    update: true,
    upload: {
      enabled: true,
      // Extensions shown in the file picker (the `accept` attribute)
      formats: ['vtt'],
    },
  },
});
```

If `formats` only contains `vtt`, no `process` hook is required — the file is added as-is.

### Converting other formats with a `process` hook

To accept formats other than WebVTT, list their extensions in `formats` and supply a `process` hook that converts the file to WebVTT.
The hook is called (with the player as `this`) with `{ file, text, label }` and may **return, or resolve to**, one of:

| Return value      | Meaning                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------- |
| a `string`        | Treated as WebVTT text                                                                     |
| a track `object`  | `{ text \| src, label?, srclang?, kind?, default? }` — passed straight to `addCaptionTrack` |
| a falsy value     | Abort — you've handled (or rejected) the file yourself                                     |

The hook may be synchronous or return a `Promise` (useful if your parser is async or you need to fetch something).

#### Example: SRT/VTT with [subsrt](https://github.com/papnkukn/subsrt)

```js
import subsrt from 'subsrt';

const player = new Plyr('#player', {
  captions: {
    active: true,
    update: true,
    upload: {
      enabled: true,
      formats: ['vtt', 'srt', 'ass', 'ssa'],
      process({ file, text, label }) {
        // Already WebVTT? Add it verbatim.
        if (file.name.toLowerCase().endsWith('.vtt')) {
          return { text, label };
        }

        // Otherwise convert to WebVTT with subsrt.
        const vtt = subsrt.convert(text, { format: 'vtt' });
        return { text: vtt, label };
      },
    },
  },
});
```

#### Example: rejecting invalid files

```js
upload: {
  enabled: true,
  formats: ['vtt'],
  process({ file, text, label }) {
    if (!text.startsWith('WEBVTT')) {
      window.alert('That doesn’t look like a valid WebVTT file.');
      return false; // abort
    }
    return { text, label };
  },
}
```

## Reference

### Options

Set under the [`captions`](README.md#options) option:

| Option           | Type                | Default   | Description                                                                                                                            |
| ---------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `upload.enabled` | Boolean             | `false`   | Adds an "Upload captions" item to the captions menu.                                                                                  |
| `upload.formats` | Array               | `['vtt']` | File extensions offered in the picker (used for the `accept` attribute). Anything other than `vtt` requires a `process` hook.         |
| `upload.process` | Function \| `null`  | `null`    | Hook to transform a selected file into WebVTT before it's added. See [above](#converting-other-formats-with-a-process-hook).           |

### `player.addCaptionTrack(options)`

Adds a caption/subtitle track to the media and refreshes the menu. Returns the created `HTMLTrackElement`, or `null` if `options` is
invalid.

| Key       | Type    | Default      | Description                                                        |
| --------- | ------- | ------------ | ----------------------------------------------------------------- |
| `text`    | String  | —            | Inline WebVTT content. Required unless `src`/`url` is given.       |
| `src`     | String  | —            | URL to a track file. Required unless `text` is given.             |
| `url`     | String  | —            | Alias for `src`.                                                  |
| `label`   | String  | —            | Human-readable label shown in the menu.                           |
| `srclang` | String  | —            | ISO two-letter language code.                                     |
| `kind`    | String  | `'captions'` | Track kind (`captions`, `subtitles`, …).                          |
| `default` | Boolean | `false`      | Marks the track as the default.                                   |
