declare interface IGridGalleryStrings {
  PropertyPaneDescription: string;
  PropertyPageGeneral: string;
  PropertyPageTextPanel: string;
  PropertyPageBorder: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  GeneralGroupName: string;
  BorderGroupName: string;
  TilesTypeFieldLabel: string;
  EnableIconsFieldLabel: string;
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
  EnableShadowFieldLabel: string;
  EnableBorderFieldLabel: string;
  SpaceBetweenColsFieldLabel: string;
  BorderColorFieldLabel: string;
  BorderFieldLabel: string;
  ErrorSelectList: string;
  ErrorNoItems: string;
  Loading: string;

  EffectsGroupName: string;
  Transition: string;
  EnableProgressIndicator: string;

  EnableArrows: string;
  EnableBullets: string;
  EnablePlayButton: string;
  EnableFullscreenButton: string;
  EnableZoomPanel: string;
  ControlsAlwaysOn: string;
  PreserveRatio: string;
  PauseOnMouseover: string;
  Carousel: string;
  Autoplay: string;
  Speed: string;
  TileDimension: string;
  Position: string;
  NumCols: string;
}

declare module 'gridGalleryStrings' {
  const strings: IGridGalleryStrings;
  export = strings;
}
