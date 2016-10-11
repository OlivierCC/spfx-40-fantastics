/**
 * @file
 * Animated Text Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'ImageNotesStrings';
import { IImageNotesWebPartProps } from './IImageNotesWebPartProps';

import { PropertyFieldPicturePicker } from 'sp-client-custom-fields/lib/PropertyFieldPicturePicker';

export default class ImageNotesWebPart extends BaseClientSideWebPart<IImageNotesWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {

    if (this.properties.image == null || this.properties.image == '') {
      var error = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectImage}
            </div>
          </div>
        </div>
      `;
      this.domElement.innerHTML = error;
      return;
    }

    var html = '';
    this.domElement.innerHTML = html;
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
                PropertyFieldPicturePicker('image', {
                  label: strings.Image,
                  initialValue: this.properties.image,
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                }),
                PropertyPaneTextField('alt', {
                  label: strings.Alt
                }),
                PropertyPaneTextField('linkText', {
                  label: strings.LinkText
                }),
                PropertyPaneTextField('linkUrl', {
                  label: strings.LinkUrl
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
