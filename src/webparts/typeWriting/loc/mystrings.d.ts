declare interface ITypeWritingStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TypeWritingGroupName: string;
  LayoutGroupName: string;
  Text: string;
  SplitLines: string;
  TypingInterval: string;
  BlinkInterval: string;
  CursorColor: string;
  Font: string;
  FontSize: string;
  FontColor: string;
  BackgroundColor: string;
}

declare module 'TypeWritingStrings' {
  const strings: ITypeWritingStrings;
  export = strings;
}
