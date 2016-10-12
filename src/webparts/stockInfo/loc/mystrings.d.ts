declare interface IStockInfoStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Stock: string;
  Width: string;
  Height: string;
  Region: string;
  Lang: string;
  ErrorSelectStock: string;
}

declare module 'StockInfoStrings' {
  const strings: IStockInfoStrings;
  export = strings;
}
