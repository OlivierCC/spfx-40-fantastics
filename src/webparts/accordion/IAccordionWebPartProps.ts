/**
 * @file
 * Accordion Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface IAccordionWebPartProps {
  text: string;
  inline: boolean;
  tabs: any[];
  collapsible: boolean;
  animate: boolean;
  speed: number;
  heightStyle: string;
}
