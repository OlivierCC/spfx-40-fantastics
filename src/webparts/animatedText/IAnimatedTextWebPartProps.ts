/**
 * @file
 * Ainmated Text Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IAnimatedTextWebPartProps {
  text: string;
  effect: string;
  effectDirection: string;
  timing: number;
  duration: number;
  letterEnd: string;
  elementEnd: string;
  font: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  align: string;
}
