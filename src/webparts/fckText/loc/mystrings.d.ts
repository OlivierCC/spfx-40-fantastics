declare interface IFckTextStrings {
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
  ItemWidthFieldLabel: string;
  ReadMore: string;
  Easing: string;
  Density: string;
  InnerOffset: string;
  InnerScale: string;
  Shadow: string;
  PropertyPageTextPanel: string;
  TextPanelGroupName: string;
  TextPanelEnableFieldLabel: string;
  TextPanelAlwaysOnTopFieldLabel: string;
  TextPanelPositionFieldLabel: string;
  TextPanelOpacityFieldLabel: string;
  TextPanelFontFieldLabel: string;
  TextPanelFontSizeFieldLabel: string;
  TextPanelBackgroundColorFieldLabel: string;
  TextPanelAlignFieldLabel: string;
  TextPanelFontColorFieldLabel: string;

  Inline: string;
  Mode: string;
  Theme: string;
}

declare module 'fckTextStrings' {
  const strings: IFckTextStrings;
  export = strings;
}
