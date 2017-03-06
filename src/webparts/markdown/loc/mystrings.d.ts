declare interface IMarkdownStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Toolbar: string;
  ToolbarTips: string;
  Status: string;
  SpellChecker: string;
}

declare module 'MarkdownStrings' {
  const strings: IMarkdownStrings;
  export = strings;
}
