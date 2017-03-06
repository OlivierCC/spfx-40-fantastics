declare interface IPieChartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Items: string;
  ManageItems: string;
  Responsive: string;
  Dimension: string;
  OptionsGroupName: string;
  CutoutPercentage: string;
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

declare module 'PieChartStrings' {
  const strings: IPieChartStrings;
  export = strings;
}
