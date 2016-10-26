/**
 * @file
 * Text Rotator Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ITextRotatorWebPartProps {
  text: string;
  effect: string;
  duration: number;
  font: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  align: string;
}
