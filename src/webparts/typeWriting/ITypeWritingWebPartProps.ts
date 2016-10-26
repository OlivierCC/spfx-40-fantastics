/**
 * @file
 * TypeWriting Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ITypeWritingWebPartProps {
  text: string;
  splitLines: boolean;
  font: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  typingInterval: number;
  blinkInterval: number;
  cursorColor: string;
}
