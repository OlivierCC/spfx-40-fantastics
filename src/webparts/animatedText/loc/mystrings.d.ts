declare interface IAnimatedTextStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LayoutGroupName: string;
  Text: string;
  Font: string;
  FontSize: string;
  FontColor: string;
  BackgroundColor: string;
  Effet: string;
  Direction: string;
  Timing: string;
  Duration: string;
  LetterEnd: string;
  ElementEnd: string;
  Align: string;
}

declare module 'AnimatedTextStrings' {
  const strings: IAnimatedTextStrings;
  export = strings;
}
