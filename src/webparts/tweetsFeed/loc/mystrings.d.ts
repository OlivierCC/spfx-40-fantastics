declare interface ITweetsFeedStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ErrorSelectAccount: string;
  Account: string;
  Limit: string;
  Header: string;
  Footer: string;
  Borders: string;
  Scrollbars: string;
  Width: string;
  Height: string;
  Transparent: string;
  Dark: string;
  LinkColor: string;
  BorderColor: string;
  LayoutGroupName: string;
  AutoLimit: string;
}

declare module 'TweetsFeedStrings' {
  const strings: ITweetsFeedStrings;
  export = strings;
}
