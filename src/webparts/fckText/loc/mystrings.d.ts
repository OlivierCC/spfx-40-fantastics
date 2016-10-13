declare interface IFckTextStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Inline: string;
  Mode: string;
  Theme: string;
}

declare module 'fckTextStrings' {
  const strings: IFckTextStrings;
  export = strings;
}
