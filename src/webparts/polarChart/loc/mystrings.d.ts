declare interface IPolarChartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Dimension: string;
  Items: string;
  ManageItems: string;
  Label: string;
  Value: string;
  Color: string;
  HoverColor: string;
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
  Responsive: string;
}

declare module 'PolarChartStrings' {
  const strings: IPolarChartStrings;
  export = strings;
}
