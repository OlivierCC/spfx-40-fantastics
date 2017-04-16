declare interface ITabsStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TextEditorGroupName: string;
  LayoutGroupName: string;
  DescriptionFieldLabel: string;
  Inline: string;
  ManageTabs: string;
  Tabs: string;
  DisableColor: string;
  SelectedColor: string;
  ErrorClassicSharePoint: string;
}

declare module 'TabsStrings' {
  const strings: ITabsStrings;
  export = strings;
}
