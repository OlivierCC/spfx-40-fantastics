/**
 * @file
 * QR Code Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'QrCodeStrings';
import { IQrCodeWebPartProps } from './IQrCodeWebPartProps';

import { PropertyFieldDimensionPicker } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

import * as $ from 'jquery';
require('qrcode');

export default class QrCodeWebPart extends BaseClientSideWebPart<IQrCodeWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Gets WP data version
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '<div id="' + this.guid + '"></div>';
    this.domElement.innerHTML = html;
    var width: number = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
    var height: number = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));

    if (this.properties.mode == "table") {
            ($ as any)('#' + this.guid).qrcode({
                render: "table",
                text: this.properties.text,
                width: width,
                height: height
            });
    }
    else {
            ($ as any)('#' + this.guid).qrcode({
                text: this.properties.text,
                width: width,
                height: height
            });
    }
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyFieldDimensionPicker('dimension', {
                  label: strings.Dimension,
                  initialValue: this.properties.dimension,
                  preserveRatio: true,
                  preserveRatioEnabled: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  disabled: false,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'qrCodeDimensionFieldId'
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
