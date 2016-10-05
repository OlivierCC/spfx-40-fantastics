declare interface IDockMenuStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SpeedFieldLabel: string;
  AutoplayFieldLabel: string;
  AutoplayDelayFieldLabel: string;
  BringtoFrontFieldLabel: string;
  ShowButtonsFieldLabel: string;
  MirrorGapFieldLabel: string;
  MirrorHeightFieldLabel: string;
  MirrorOpacityFieldLabel: string;
  YOriginFieldLabel: string;
  YRadiusFieldLabel: string;
  XOriginFieldLabel: string;
  XRadiusFieldLabel: string;
  MirrorGroupName: string;
  GeneralGroupName: string;
  OriginGroupName: string;
  ShowTitleFieldLabel: string;
  DataGroupName: string;
  DataFieldLabel: string;
  TitleGroupName: string;
  FontFieldLabel: string;
  FontSizeFieldLabel: string;
  ColorFieldLabel: string;
  HeightFieldLabel: string;
  ItemHeightFieldLabel: string;
  ReadMore: string;
}

declare module 'dockMenuStrings' {
  const strings: IDockMenuStrings;
  export = strings;
}
