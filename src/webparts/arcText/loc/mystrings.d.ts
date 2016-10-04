declare interface IArcTextStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TextFieldLabel: string;
  FontFieldLabel: string;
  FontSizeFieldLabel: string;
  ColorFieldLabel: string;
  EffectGroupName: string;
  RadiusFieldLabel: string;
  DirectionFieldLabel: string;
  RotateLetterFieldLabel: string;
  AlignFieldLabel: string;
  AlignRight: string;
  AlignCenter: string;
  AlignLeft: string;
}

declare module 'arcTextStrings' {
  const strings: IArcTextStrings;
  export = strings;
}
