/**
 * @file
 * Tweets Feed Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ITweetsFeedWebPartProps {
  account: string;
  autoLimit: boolean;
  limit: number;
  header: boolean;
  footer: boolean;
  borders: boolean;
  scrollbars: boolean;
  width: string;
  height: string;
  transparent: boolean;
  dark: boolean;
  linkColor: string;
  borderColor: string;
}
