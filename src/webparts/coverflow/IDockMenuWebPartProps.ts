/**
 * @file
 * Coverflow Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IDockMenuWebPartProps {
  duration: string;
  easing: string;
  items: any[];
  density: number;
  innerOffset: number;
  innerScale: number;
  shadow: boolean;
  textPanelEnable: boolean;
  textPanelAlwaysOnTop: boolean;
  textPanelPosition: string;
  textPanelOpacity: string;
  textPanelFont: string;
  textPanelFontSize: string;
  textPanelFontColor: string;
  textPanelBackgroundColor: string;
  textPanelAlign: string;
}
