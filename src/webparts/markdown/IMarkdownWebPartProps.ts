/**
 * @file
 * Markdown Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IMarkdownWebPartProps {
  text: string;
  toolbar: boolean;
  toolbarTips: boolean;
  status: boolean;
  spellChecker: boolean;
}
