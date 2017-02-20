/**
 * @file
 * Syntax Highlighter Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ISyntaxHighlighterWebPartProps {
  code: string;
  language: string;
  toolbar: boolean;
  gutter: boolean;
  autoLinks: boolean;
  smartTabs: boolean;
}
