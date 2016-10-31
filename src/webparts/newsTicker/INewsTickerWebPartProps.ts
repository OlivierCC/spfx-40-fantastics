/**
 * @file
 * News Ticker Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface INewsTickerWebPartProps {
  items: any[];
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  font: string;
  fontSize: string;
  fontColor: string;
  fontMssg: string;
  fontSizeMssg: string;
  fontColorMssg: string;
  speed: number;
  align: string;
  borderRadius: number;
  pausedMouseHover: boolean;
}
