declare interface INewsCarouselStrings {
  PropertyPageGeneral: string;
  PropertyPageTextPanel: string;
  BasicGroupName: string;
  GeneralGroupName: string;
  TextPanelGroupName: string;
  TextPanelEnableFieldLabel: string;
  TextPanelAlwaysOnTopFieldLabel: string;
  TextPanelOpacityFieldLabel: string;
  TextPanelFontFieldLabel: string;
  TextPanelFontSizeFieldLabel: string;
  TextPanelBackgroundColorFieldLabel: string;
  TextPanelAlignFieldLabel: string;
  TextPanelFontColorFieldLabel: string;
  ErrorSelectList: string;
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
  Items: string;
  ManageItems: string;
}

declare module 'NewsCarouselStrings' {
  const strings: INewsCarouselStrings;
  export = strings;
}
