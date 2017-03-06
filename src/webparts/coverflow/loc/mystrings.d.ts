declare interface IDockMenuStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  SpeedFieldLabel: string;
  DataGroupName: string;
  DataFieldLabel: string;
  FontFieldLabel: string;
  FontSizeFieldLabel: string;
  ColorFieldLabel: string;
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
}

declare module 'dockMenuStrings' {
  const strings: IDockMenuStrings;
  export = strings;
}
