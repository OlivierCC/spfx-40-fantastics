/**
 * @file
 * News Ticker Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewsTickerStrings';
import { INewsTickerWebPartProps } from './INewsTickerWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

export default class NewsTickerWebPart extends BaseClientSideWebPart<INewsTickerWebPartProps> {

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
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '';
    html += `
<div class="news-${this.guid} color-${this.guid}">
	<span>${this.properties.title}</span>
	<ul>
  `;

    for (var i = 0; i < this.properties.items.length; i++) {
      var item = this.properties.items[i];
      if (item['Enable'] != 'false') {
        html += '<li><a href="' + item['Link Url'] + '">' + item['Title'] + '</li>';
      }
    }

    var paused = 'paused';
    if (this.properties.pausedMouseHover === false)
      paused = 'running';

  html += `
	</ul>
</div>
<style>
@keyframes ticker {
	0%   {margin-top: 0}
	25%  {margin-top: -30px}
	50%  {margin-top: -60px}
	75%  {margin-top: -90px}
	100% {margin-top: 0}
}

.news-${this.guid} {
  box-shadow: inset 0 -15px 30px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.5);
  width: ${this.properties.width};
  height: ${this.properties.height};
  overflow: hidden;
  border-radius: ${this.properties.borderRadius}px;
  padding: 3px;
  -webkit-user-select: none
}

.news-${this.guid} span {
  float: left;
  color: ${this.properties.fontColor};
  padding: 6px;
  position: relative;
  top: 1%;
  border-radius: ${this.properties.borderRadius}px;
  box-shadow: inset 0 -15px 30px rgba(0,0,0,0.4);
  font: ${this.properties.fontSize} ${this.properties.font};
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: none;
  cursor: pointer
}

.news-${this.guid} ul {
  float: left;
  padding-left: 20px;
  animation: ticker ${this.properties.speed}s cubic-bezier(1, 0, .5, 0) infinite;
  -webkit-user-select: none
}

.news-${this.guid} ul li {line-height: ${this.properties.height}; list-style: none }

.news-${this.guid} ul li a {
  color: ${this.properties.fontColorMssg};
  text-decoration: none;
  font: ${this.properties.fontSizeMssg} ${this.properties.fontMssg};
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: none
}

.news-${this.guid} ul:hover { animation-play-state: ${paused} }
.news-${this.guid} span:hover+ul { animation-play-state: ${paused} }

/* OTHER COLORS */
.color-${this.guid} { background: ${this.properties.backgroundColor} }
</style>
    `;
    this.domElement.innerHTML = html;

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
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCustomList('items', {
                  label: strings.Items,
                  value: this.properties.items,
                  headerText: strings.ManageItems,
                  fields: [
                    { title: 'Title', required: true, type: CustomListFieldType.string },
                    { title: 'Enable', required: true, type: CustomListFieldType.boolean },
                    { title: 'Link Url', required: true, hidden: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyChanged,
                  context: this.context,
                  properties: this.properties
                }),
                PropertyPaneSlider('speed', {
                  label: strings.Speed,
                  min: 1,
                  max: 20,
                  step: 1
                }),
                PropertyPaneToggle('pausedMouseHover', {
                  label: strings.PausedMouseHover
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField('width', {
                  label: strings.Width
                }),
                PropertyPaneTextField('height', {
                  label: strings.Height
                }),
                PropertyPaneSlider('borderRadius', {
                  label: strings.BorderRadius,
                  min: 0,
                  max: 10,
                  step: 1
                }),
                PropertyFieldColorPicker('backgroundColor', {
                  label: strings.BackgroundColor,
                  initialColor: this.properties.backgroundColor,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                })
              ]
            },
            {
              groupName: strings.TitleGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.Title
                }),
                PropertyFieldFontPicker('font', {
                  label: strings.Font,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSize,
                  initialValue: this.properties.fontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('fontColor', {
                  label: strings.FontColor,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                })
              ]
            },
            {
              groupName: strings.ItemsGroupName,
              groupFields: [
                PropertyFieldFontPicker('fontMssg', {
                  label: strings.Font,
                  initialValue: this.properties.fontMssg,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('fontSizeMssg', {
                  label: strings.FontSize,
                  initialValue: this.properties.fontSizeMssg,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('fontColorMssg', {
                  label: strings.FontColor,
                  initialColor: this.properties.fontColorMssg,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
