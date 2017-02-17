import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * Image Puzzle Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IImagePuzzleWebPartProps {
  image: string;
  dimension: IPropertyFieldDimension;
  frequence: number;
  columns: number;
  rows: number;
  distinct: boolean;
  margin: number;
  alt: string;
  linkUrl: string;
  linkText: string;
}
