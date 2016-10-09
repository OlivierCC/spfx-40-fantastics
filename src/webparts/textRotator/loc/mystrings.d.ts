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
  Duration: string;
  Align: string;
}

declare module 'TextRotatorStrings' {
  const strings: ITextRotatorStrings;
  export = strings;
}
