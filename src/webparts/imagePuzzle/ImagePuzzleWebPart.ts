/**
 * @file
 * Image Puzzle Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneSlider,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'ImagePuzzleStrings';
import { IImagePuzzleWebPartProps } from './IImagePuzzleWebPartProps';

import { PropertyFieldPicturePicker } from 'sp-client-custom-fields/lib/PropertyFieldPicturePicker';

require('jquery');
require('jigsaw');

import * as $ from 'jquery';

export default class ImagePuzzleWebPart extends BaseClientSideWebPart<IImagePuzzleWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);

    this.guid = this.getGuid();
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
    if (this.properties.linkUrl != null && this.properties.linkUrl != '')
      html += '<a href="' + this.properties.linkUrl + '">';
    html += '<div id="' + this.guid + '"><img src="' + this.properties.image + '" width="' + this.properties.width + '" height="' + this.properties.height + '" alt="' + this.properties.alt + '" title="' + this.properties.alt + '"></div>';
    if (this.properties.linkUrl != null && this.properties.linkUrl != '')
      html += '</a>';
    this.domElement.innerHTML = html;

    ($ as any)("#" + this.guid).jigsaw({
      freq: this.properties.frequence,
      x: this.properties.columns,
      y: this.properties.rows,
      margin: this.properties.margin
    });
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
          displayGroupsAsAccordion: true,
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
                PropertyPaneTextField('width', {
                  label: strings.Width
                }),
                PropertyPaneTextField('height', {
                  label: strings.Height
                }),
                PropertyPaneTextField('alt', {
                  label: strings.Alt
                }),
                PropertyPaneTextField('linkUrl', {
                  label: strings.LinkUrl
                })
              ]
            },
            {
              groupName: strings.PuzzleGroupName,
              groupFields: [
                PropertyPaneSlider('frequence', {
                  label: strings.Frequence,
                  min: 0,
                  max: 5000,
                  step: 100
                }),
                PropertyPaneSlider('columns', {
                  label: strings.Columns,
                  min: 1,
                  max: 20,
                  step: 1
                }),
                PropertyPaneSlider('rows', {
                  label: strings.Rows,
                  min: 1,
                  max: 20,
                  step: 1
                }),
                PropertyPaneSlider('margin', {
                  label: strings.Margin,
                  min: 0,
                  max: 50,
                  step: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
