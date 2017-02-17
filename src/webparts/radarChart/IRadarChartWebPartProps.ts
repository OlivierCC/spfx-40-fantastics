import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * Radar Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IRadarChartWebPartProps {
  items: any[];
  responsive: boolean;
  dimension: IPropertyFieldDimension;
  horizontal: boolean;
  titleEnable: boolean;
  title: string;
  position: string;
  titleFont: string;
  titleSize: string;
  titleColor: string;
  legendEnable: boolean;
  legendPosition: string;
  legendFont: string;
  legendSize: string;
  legendColor: string;
  xAxesEnable: boolean;
  yAxesEnable: boolean;
  axesFont: string;
  axesFontSize: string;
  axesFontColor: string;
  borderWidth: number;
  pointStyle: string;
  fill: string;
  lineTension: number;
  showLine: boolean;
  fillColor: string;
  steppedLine: boolean;
}
