const sources = {
  mux: {
    type: 'video',
    title: 'View From A Blue Moon',
    ratio: '16:9',
    hlsSource: 'https://stream.mux.com/lyrKpPcGfqyzeI00jZAfW6MvP6GNPrkML.m3u8',
    poster: 'https://image.mux.com/lyrKpPcGfqyzeI00jZAfW6MvP6GNPrkML/thumbnail.jpg',
    previewThumbnails: {
      enabled: true,
      src: 'https://image.mux.com/lyrKpPcGfqyzeI00jZAfW6MvP6GNPrkML/storyboard.vtt',
    },
  },
  video: {
    type: 'video',
    title: 'View From A Blue Moon',
    ratio: '16:9',
    sources: [
      {
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
        type: 'video/mp4',
        size: 576,
      },
      {
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
        type: 'video/mp4',
        size: 720,
      },
      {
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
        type: 'video/mp4',
        size: 1080,
      },
      {
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1440p.mp4',
        type: 'video/mp4',
        size: 1440,
      },
    ],
    poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    tracks: [
      {
        kind: 'captions',
        label: 'English',
        srclang: 'en',
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
        default: true,
      },
      {
        kind: 'captions',
        label: 'French',
        srclang: 'fr',
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt',
      },
    ],
    previewThumbnails: {
      enabled: true,
      src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt'],
    },
    mediaMetadata: {
      title: 'View From A Blue Moon',
      album: 'Sports',
      artist: 'Brainfarm',
      artwork: [
        {
          src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
          type: 'image/jpeg',
        },
      ],
    },
    markers: {
      enabled: true,
      points: [
        {
          time: 10,
          label: 'First marker',
        },
        {
          time: 40,
          label: 'Second marker',
        },
        {
          time: 120,
          label: '<strong>Third</strong> marker',
        },
      ],
    },
  },
  audio: {
    type: 'audio',
    title: 'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
    sources: [
      {
        src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
        type: 'audio/mp3',
      },
      {
        src: 'https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
        type: 'audio/ogg',
      },
    ],
  },
  youtube: {
    type: 'video',
    ratio: '16:9',
    sources: [
      {
        src: 'https://youtube.com/watch?v=bTqVqk7FSmY',
        provider: 'youtube',
      },
    ],
    mediaMetadata: {
      title: 'View From A Blue Moon',
      album: 'Sports',
      artist: 'Brainfarm',
      artwork: [
        {
          src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
          type: 'image/jpeg',
        },
      ],
    },
  },
  vimeo: {
    type: 'video',
    ratio: '16:9',
    sources: [
      {
        src: 'https://vimeo.com/40648169',
        provider: 'vimeo',
      },
    ],
  },
};

export default sources;
