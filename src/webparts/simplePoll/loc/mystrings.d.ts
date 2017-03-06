declare interface ISimplePollStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  FontFieldLabel: string;
  FontSizeFieldLabel: string;
  ColorFieldLabel: string;
  EffectGroupName: string;
  Answers: string;
  ManageAnswers: string;
  surveyList: string;
  ErrorSelectList: string;
  ErrorNoItems: string;
  chartType: string;
  forceVoteToViewResults: string;
  ThankYou: string;
  Recorded: string;
  OK: string;
  Error: string;
  SelectVote: string;
  Vote: string;
  ViewResults: string;
  AlreadyVote: string;
  Back: string;
}

declare module 'SimplePollStrings' {
  const strings: ISimplePollStrings;
  export = strings;
}
