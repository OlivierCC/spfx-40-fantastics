import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IBingMapWebPartProps {
  api: string;
  dimension: IPropertyFieldDimension;

  position: string;
  address: number;
  title: string;
  description: string;

  zoomLevel: number;
  mapMode: string;
  mapStyle: string;
  pushPin: boolean;
  showDashBoard: boolean;
  dashBoardStyle: string;
  showScaleBar: boolean;
  allowMouseWheelZoom: boolean;
}
