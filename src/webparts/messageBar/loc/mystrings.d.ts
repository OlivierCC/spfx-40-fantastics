declare interface IMessageBarStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LayoutGroupName: string;
  Text: string;
  Font: string;
  FontSize: string;
  FontColor: string;
  BackgroundColor: string;
  Enabled: string;
  Icon: string;
}

declare module 'MessageBarStrings' {
  const strings: IMessageBarStrings;
  export = strings;
}
