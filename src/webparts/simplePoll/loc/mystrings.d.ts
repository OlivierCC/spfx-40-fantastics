declare interface ISimplePollStrings {
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
  Answers: string;
  ManageAnswers: string;
}

declare module 'SimplePollStrings' {
  const strings: ISimplePollStrings;
  export = strings;
}
