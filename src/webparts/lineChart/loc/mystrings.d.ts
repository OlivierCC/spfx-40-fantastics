declare interface ILineChartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Items: string;
  ManageItems: string;
  Responsive: string;
  Dimension: string;
  OptionsGroupName: string;
  Fill: string;
  ShowLine: string;
  SteppedLine: string;
  XAxesEnable: string;
  YAxesEnable: string;
  LineTension: string;
  PointStyle: string;
  FillColor: string;
  TitleGroupName: string;
  TitleEnable: string;
  Title: string;
  Position: string;
  TitleFont: string;
  TitleSize: string;
  TitleColor: string;
}

declare module 'LineChartStrings' {
  const strings: ILineChartStrings;
  export = strings;
}
