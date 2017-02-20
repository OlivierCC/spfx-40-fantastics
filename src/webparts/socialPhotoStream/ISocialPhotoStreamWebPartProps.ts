import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ISocialPhotoStreamWebPartProps {
  network: string;
  userName: string;
  accessKey: string;
  limit: number;
  overlay: boolean;
  dimension: IPropertyFieldDimension;
  spacing: number;
}
