declare interface IBingMapStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  MapGroupName: string;
  LocationGroupName: string;
  Register: string;
  Dimension: string;
  Api: string;
  Position: string;
  Address: string;
  Title: string;
  Description: string;
  ZoomLevel: string;
  MapMode: string;
  MapStyle: string;
  PushPin: string;
  ShowDashBoard: string;
  DashBoardStyle: string;
  ShowScaleBar: string;
  AllowMouseWheelZoom: string;
}

declare module 'BingMapStrings' {
  const strings: IBingMapStrings;
  export = strings;
}
