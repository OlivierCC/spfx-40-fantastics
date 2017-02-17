import { IPropertyFieldDimension } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

/**
 * @file
 * Stock Info Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IStockInfoWebPartProps {
  stock: string;
  lang: string;
  region: string;
  dimension: IPropertyFieldDimension;
}
