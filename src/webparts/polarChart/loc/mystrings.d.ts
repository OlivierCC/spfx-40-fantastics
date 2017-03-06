declare interface IPolarChartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Items: string;
  ManageItems: string;
  Responsive: string;
  Dimension: string;
  OptionsGroupName: string;
  AnimateRotate: string;
  AnimateScale: string;
  TitleGroupName: string;
  TitleEnable: string;
  Title: string;
  Position: string;
  TitleFont: string;
  TitleSize: string;
  TitleColor: string;
  LegendGroupName: string;
  LegendEnable: string;
  LegendPosition: string;
  LegendFont: string;
  LegendSize: string;
  LegendColor: string;
}

declare module 'PolarChartStrings' {
  const strings: IPolarChartStrings;
  export = strings;
}
