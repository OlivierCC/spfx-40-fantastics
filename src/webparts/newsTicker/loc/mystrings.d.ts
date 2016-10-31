declare interface INewsTickerStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LayoutGroupName: string;
  TitleGroupName: string;
  ItemsGroupName: string;
  Title: string;
  Width: string;
  Height: string;
  BackgroundColor: string;
  Font: string;
  FontSize: string;
  FontColor: string;
  Align: string;
  Items: string;
  ManageItems: string;
  Speed: string;
  BorderRadius: string;
  PausedMouseHover: string;
}

declare module 'NewsTickerStrings' {
  const strings: INewsTickerStrings;
  export = strings;
}
