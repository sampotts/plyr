# Intent: FEAT-001 — Video reactions

**Author:** Pradeep Nair (PM), drafted with Claude · **Status:** Accepted by PM (26 Nov 2026) · **Date:** 26 Nov 2026 · **Priority:** High

## Problem

Viewers have no way to react to a video, so the business has no signal of how viewers feel about each video. Competing products such as YouTube and TikTok let users react and keep track of their interactions. Without this, we fall behind and miss the engagement data we'll need for future ad segments and monetisation.

## Proposed outcome

A viewer can react to the video they're watching with a couple of taps, and sees their earlier reaction when they come back to the same video. Each reaction sends out an event that the brand's own analytics (for example Adobe Analytics) can record. Each brand decides whether to turn the feature on for its site or app.

**The videos**

- Short, **vertical (portrait, 9:16) videos of up to about 10 seconds**, produced by our brands, plus some third-party videos.
- They are our own video files, not YouTube or Vimeo embeds.

**How it behaves**

- **A "React" button on the player.** Tapping it opens a row of reactions in a small bubble just above the button. Picking one closes the row, and the button then shows the chosen reaction.
- **Reactions:** up to 7, chosen by each brand. The default set is 👍 ❤️ 👏 😲 😢 🔥 😡, with the codes `thumbs_up`, `heart`, `clap`, `wow`, `sad`, `fire`, `angry`.
- **One reaction per viewer per video.** Picking a different reaction switches to it; picking the same one again removes it.
- **Remembered in the viewer's browser or app** across visits until the viewer clears their data. Nothing is sent to a server.
- **No counts are shown.** The player only knows the viewer's own reaction.
- **Event for analytics:** each change fires a `reaction` event. The player contains no analytics vendor code; the brand's site or app maps the event to its eVars and events. The event carries:
  - `video_id`: the brand's own ID for the video, passed into the player.
  - `reaction`: one of the codes above. Removing a reaction sends `removed`.
  - `channel`: `Web` when viewed on a brand's website, `Mobile` when viewed in a brand's mobile app.
  - `brand`: the brand's name.

  The player doesn't know `channel` and `brand`. The website or app sets them once when it sets up the player, and the player includes them in every event.

- **Off by default.** A brand turns it on in the player setup, or with a `data-` attribute on the page.
- **Testable before launch:** a demo page in the repo with reactions turned on, using a vertical sample video. Brands turn it on in their staging/UAT setup first.

## Business benefit and rationale

- **Keeps us competitive** with features viewers expect from YouTube and TikTok.
- **First-party engagement data per video,** which is the foundation for future ad segments and monetisation.
- **Low cost and low risk in phase 1:** no backend. Brands adopt it when they're ready.

## Success criteria

- **Engagement:** at least **5% of plays** on brands with the feature turned on get a reaction in the first month.
- **No impact on performance:**
  - the player makes no extra network requests,
  - no noticeable delay to start-up or playback,
  - the player file grows by only a few KB (exact budget set by the tech lead).
- **Works on vertical video:** the React button and reaction row fit and work on a 9:16 player on phone-sized screens.
- **Analytics works:** in UAT, a reaction shows up in a brand's analytics with all four fields.
- **No change for other brands:** brands that don't turn it on see no difference.

## Affected users and systems

- **Viewers** on brand websites and mobile apps.
- **Brand web and app teams:** turn it on, choose the reactions, provide video IDs, set `channel` and `brand`.
- **Analytics teams:** map the `reaction` event to Adobe Analytics eVars and events.
- **The player (Plyr):** a new option, a new control, a new event and storage on the viewer's device.
- **Not affected:** backend services.

## Constraints

- **Pluggable and consistent with Plyr's architecture:** an option, a control and an event, in the same way existing features work.
- **Must not change the player's frozen build settings** (see `AGENTS.md`).
- **Accessible:** works with keyboard, touch and screen readers.
- **Minimal data:** store only the video ID and the reaction on the device. No personal data.
- **No backend in phase 1.**

## Out of scope (phase 1)

- Server-side storage (a later phase; the technology is for engineering to choose).
- Reaction counts or totals.
- User accounts.
- Moderation.
- YouTube and Vimeo videos.
- Native (non-web) mobile players.
- Consent handling (to revisit before any real launch).
- The analytics mapping itself, which each brand handles.

## Notes for the tech lead (Stage 3 assessment)

1. **Vertical video:** Plyr has a `ratio` option (for example `'9:16'`) and otherwise uses the video's own dimensions, so portrait should be supported. Check how the control bar and the reaction row look at 9:16 on a phone-sized screen.
2. **Video format:** assumed to be plain files such as MP4. If brands stream with HLS (`.m3u8`), Plyr needs an extra library, so confirm this.
3. **Mobile app:** assumed to show this web player inside the app (a web view) and set `channel: 'Mobile'`.
