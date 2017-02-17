import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * Polar Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IPolarChartWebPartProps {
  items: any[];
  responsive: boolean;
  dimension: IPropertyFieldDimension;
  cutoutPercentage: number;
  rotation: number;
  circumference: number;
  animateRotate: boolean;
  animateScale: boolean;
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
}
