declare interface IBingTranslatorStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  theme: string;
  color: string;
  backgroundColor: string;
  start: string;
  language: string;
}

declare module 'BingTranslatorStrings' {
  const strings: IBingTranslatorStrings;
  export = strings;
}
