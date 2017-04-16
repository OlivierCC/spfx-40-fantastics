declare interface IFckTextStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Inline: string;
  ErrorClassicSharePoint: string;
}

declare module 'fckTextStrings' {
  const strings: IFckTextStrings;
  export = strings;
}
