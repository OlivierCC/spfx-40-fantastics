declare interface IBarChartStrings {
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
  Horizontal: string;
  XAxesEnable: string;
  YAxesEnable: string;
  AxesFont: string;
  AxesFontSize: string;
  AxesFontColor: string;
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
  BorderWidth: string;
}

declare module 'BarChartStrings' {
  const strings: IBarChartStrings;
  export = strings;
}
