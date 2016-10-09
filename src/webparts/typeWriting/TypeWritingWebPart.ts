/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext
} from '@microsoft/sp-client-preview';
import { DisplayMode } from '@microsoft/sp-client-base';

import * as strings from 'TypeWritingStrings';
import { ITypeWritingWebPartProps } from './ITypeWritingWebPartProps';

export default class TypeWritingWebPart extends BaseClientSideWebPart<ITypeWritingWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();
  }

  public render(): void {

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode
    }
    else {
      //Read Mode
    }
  }

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
              ]
            }
          ]
        }
      ]
    };
  }
}
