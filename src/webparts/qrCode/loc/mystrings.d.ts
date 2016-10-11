declare interface IQrCodeStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Text: string;
  Mode: string;
  Width: string;
  Height: string;
}

declare module 'QrCodeStrings' {
  const strings: IQrCodeStrings;
  export = strings;
}
