declare interface ITabsStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TextEditorGroupName: string;
  LayoutGroupName: string;
  DescriptionFieldLabel: string;
  Inline: string;
  Mode: string;
  Theme: string;
  ManageTabs: string;
  Tabs: string;
  DisableColor: string;
  SelectedColor: string;
}

declare module 'TabsStrings' {
  const strings: ITabsStrings;
  export = strings;
}
