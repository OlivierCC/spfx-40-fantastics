import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IAudioEqualizerWebPartProps {
  audio: string;
  audioType: string;
  dimension: IPropertyFieldDimension;
  color: string;
  color1: string;
  color2: string;
  bars: number;
  barMargin: number;
  components: number;
  componentMargin: number;
  frequency: number;
  refreshTime: number;
}
