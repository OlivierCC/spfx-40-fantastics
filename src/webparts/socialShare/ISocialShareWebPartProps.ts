/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ISocialShareWebPartProps {
  pubid: string;
  style: string;
  size: string;
  yammer: boolean;
  linkedin: boolean;
  twitter: boolean;
  facebook: boolean;
  googlePlus: boolean;
  more: boolean;
  count: boolean;
  services: string[];
}
