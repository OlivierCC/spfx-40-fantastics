declare interface IRssReaderStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LayoutGroupName: string;
  feedUrl: string;
  maxCount: string;
  showDesc: string;
  showPubDate: string;
  descCharacterLimit: string;
  titleLinkTarget: string;
  dateFormat: string;
  dateFormatLang: string;
  backgroundColor: string;
  font: string;
  fontSize: string;
  fontColor: string;
}

declare module 'RssReaderStrings' {
  const strings: IRssReaderStrings;
  export = strings;
}
