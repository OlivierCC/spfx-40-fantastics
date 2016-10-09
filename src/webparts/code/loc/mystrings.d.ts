declare interface ICodeStrings {
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

declare module 'CodeStrings' {
  const strings: ICodeStrings;
  export = strings;
}
