/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ICarousel3DWebPartProps {
  description: string;
  speed: number;
  showButton: boolean;
  showTitle: boolean;
  autoPlay: boolean;
  autoPlayDelay: number;
  bringToFront: boolean;
  farScale: number;
  mirrorGap: number;
  mirrorHeight: number;
  mirrorOpacity: number;
  yOrigin: number;
  yRadius: number;
  xOrigin: number;
  xRadius: number;
  items: any[];
  font: string;
  fontSize: string;
  fontColor: string;
  height: number;
  itemHeight: number;
}
