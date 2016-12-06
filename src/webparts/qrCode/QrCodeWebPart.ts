/**
 * @file
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'QrCodeStrings';
import { IQrCodeWebPartProps } from './IQrCodeWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

require('jquery');

import * as $ from 'jquery';

export default class QrCodeWebPart extends BaseClientSideWebPart<IQrCodeWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '<div id="' + this.guid + '"></div>';
    this.domElement.innerHTML = html;

     ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js', 'jQuery').then((): void => {
        if (this.properties.mode == "table") {
            ($ as any)('#' + this.guid).qrcode({
                render: "table",
                text: this.properties.text,
                width: this.properties.width,
                height: this.properties.height
            });
        }
        else {
            ($ as any)('#' + this.guid).qrcode({
                text: this.properties.text,
                width: this.properties.width,
                height: this.properties.height
            });
        }
    });
  }

  /**
   * @function
   * Generates a GUID
   */
  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * @function
   * Generates a GUID part
   */
  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  /**
   * @function
   * PropertyPanel settings definition
   */
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
                PropertyPaneTextField('text', {
                  label: strings.Text
                }),
                PropertyPaneSlider('width', {
                  label: strings.Width,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneSlider('height', {
                  label: strings.Height,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneDropdown('mode', {
                  label: strings.Mode,
                  options: [
                    {key: 'canvas', text: 'Canvas'},
                    {key: 'table', text: 'Table'}
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
