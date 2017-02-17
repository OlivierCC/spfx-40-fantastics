declare interface IQrCodeStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Text: string;
  Mode: string;
  Dimension: string;
}

declare module 'QrCodeStrings' {
  const strings: IQrCodeStrings;
  export = strings;
}
