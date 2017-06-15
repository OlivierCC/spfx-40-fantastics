/**
 * @file
 * RSS Reader Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'RssReaderStrings';
import { IRssReaderWebPartProps } from './IRssReaderWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

import * as $ from 'jquery';
require('moment');
require('feedek');

export default class RssReaderWebPart extends BaseClientSideWebPart<IRssReaderWebPartProps> {

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
    html += `
<style>
.feedEkList{width:100%; list-style:none outside none;background-color: ${this.properties.backgroundColor}; border:0px solid #D3CAD7; padding:4px 6px; color:#3E3E3E;}
.feedEkList li{border-bottom:1px solid #D3CAD7; padding:5px;}
.feedEkList li:last-child{border-bottom:none;}
.itemTitle a{font-weight:bold; color:${this.properties.fontColor} !important; font-size:${this.properties.fontSize}; font-family:${this.properties.font}; text-decoration:none }
.itemTitle a:hover{ text-decoration:underline }
.itemDate{font-size:11px;color:#AAAAAA;}
</style>
    `;
    this.domElement.innerHTML = html;

        ($ as any)('#' + this.guid).FeedEk({
            FeedUrl: this.properties.feedUrl,
            MaxCount : this.properties.maxCount,
            ShowDesc : this.properties.showDesc,
            ShowPubDate: this.properties.showPubDate,
            DescCharacterLimit: this.properties.descCharacterLimit,
            TitleLinkTarget: this.properties.titleLinkTarget,
            DateFormat: this.properties.dateFormat,
            DateFormatLang: this.properties.dateFormatLang
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('feedUrl', {
                  label: strings.feedUrl
                }),
                PropertyPaneSlider('maxCount', {
                  label: strings.maxCount,
                  min: 1,
                  max: 100,
                  step: 1
                }),
                PropertyPaneToggle('showPubDate', {
                  label: strings.showPubDate
                }),
                PropertyPaneToggle('showDesc', {
                  label: strings.showDesc
                }),
                PropertyPaneSlider('descCharacterLimit', {
                  label: strings.descCharacterLimit,
                  min: 1,
                  max: 500,
                  step: 1
                }),
                PropertyPaneTextField('titleLinkTarget', {
                  label: strings.titleLinkTarget
                }),
                PropertyPaneTextField('dateFormat', {
                  label: strings.dateFormat
                }),
                PropertyPaneTextField('dateFormatLang', {
                  label: strings.dateFormatLang
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyFieldFontPicker('font', {
                  label: strings.font,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'rssReaderFontField'
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.fontSize,
                  initialValue: this.properties.fontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'rssReaderFontSizeField'
                }),
                PropertyFieldColorPickerMini('fontColor', {
                  label: strings.fontColor,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'rssReaderFontColorField'
                }),
                PropertyFieldColorPickerMini('backgroundColor', {
                  label: strings.backgroundColor,
                  initialColor: this.properties.backgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'rssReaderBgColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
