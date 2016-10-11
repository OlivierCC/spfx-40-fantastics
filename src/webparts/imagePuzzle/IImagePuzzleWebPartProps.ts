/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IImagePuzzleWebPartProps {
  image: string;
  width: string;
  height: string;
  frequence: number;
  columns: number;
  rows: number;
  distinct: boolean;
  margin: number;
  alt: string;
  linkUrl: string;
  linkText: string;
}
