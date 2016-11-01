/**
 * @file
 * RSS Reader Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IRssReaderWebPartProps {
  feedUrl: string;
  maxCount: number;
  showDesc: boolean;
  showPubDate: boolean;
  descCharacterLimit: number;
  titleLinkTarget: string;
  dateFormat: string;
  dateFormatLang: string;
  backgroundColor: string;
  font: string;
  fontSize: string;
  fontColor: string;
}
