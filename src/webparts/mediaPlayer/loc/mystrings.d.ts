declare interface IMediaPlayerStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  player: string;
  html5video: string;
  html5cover: string;
  html5captions: string;
  youtubeVideoId: string;
  vimeoVideoId: string;
  audio: string;
}

declare module 'MediaPlayerStrings' {
  const strings: IMediaPlayerStrings;
  export = strings;
}
