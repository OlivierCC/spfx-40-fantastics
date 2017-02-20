/**
 * @file
 * Tabs Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ITabsWebPartProps {
  text: string;
  inline: boolean;
  tabs: any[];
  disableColor: string;
  selectedColor: string;
  font: string;
  fontSize: string;
  disableFontColor: string;
  selectedFontColor: string;
}
