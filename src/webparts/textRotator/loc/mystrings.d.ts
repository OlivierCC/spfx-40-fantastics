declare interface ITextRotatorStrings {
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
}

declare module 'TextRotatorStrings' {
  const strings: ITextRotatorStrings;
  export = strings;
}
