declare interface IStockInfoStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Stock: string;
  Dimension: string;
  Region: string;
  Lang: string;
  ErrorSelectStock: string;
}

declare module 'StockInfoStrings' {
  const strings: IStockInfoStrings;
  export = strings;
}
