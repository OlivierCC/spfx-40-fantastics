/**
 * @file
 * Coverflow Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'dockMenuStrings';
import { IDockMenuWebPartProps } from './IDockMenuWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

//Loads external CSS
require('../../css/coverflow/coverflow.scss');

//Loads external JS libs
require('jquery');
require('jqueryui');
import * as $ from 'jquery';
require('coverflow');
require('interpolate');
require('touchSwipe');
//require('jqueryreflection');

export default class DockMenuWebPart extends BaseClientSideWebPart<IDockMenuWebPartProps> {

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

    var html = '<div class="photos" style="position: relative; width: 100%;" id="' + this.guid + '-bigCarousel">';

    if (this.properties.items != null) {
      this.properties.items.map(item => {
        if (item != null && item.Enabled != "false") {
          html += '<div><img class="cover" src="' + item.Picture + '" data-name="' + item.Title + '"/>';
          if (this.properties.textPanelEnable != false) {
            var content = item.Title;
            var linkUrl = item['Link Url'];
            var linkText = item['Link Text'];
            if (linkUrl && linkUrl != '' && linkUrl != 'undefined') {
               content += "&nbsp;<a style='color: " + this.properties.textPanelFontColor + "' href='" + linkUrl + "'>";
               var dataText = linkText;
               if (dataText == null || dataText == '')
                 dataText = strings.ReadMore;
               content += dataText;
               content += "</a>";
            }
            if (this.properties.shadow === false) {
              html += '<div style=\'position: absolute; bottom: 0px; min-height: 50px; line-height: 50px; left: 0; width: 100%; color: ' + this.properties.textPanelFontColor + '; background-color: ' + this.properties.textPanelBackgroundColor + '; font-family: ' + this.properties.textPanelFont + '; font-size: ' + this.properties.textPanelFontSize + '; text-align: ' + this.properties.textPanelAlign + ' \'><span style="padding: 8px">' + content + '</span></div>';
            }
            else {
              html += '<div style=\'position: absolute; top: 190px; min-height: 50px; line-height: 50px; left: 0; width: 100%; color: ' + this.properties.textPanelFontColor + '; background-color: ' + this.properties.textPanelBackgroundColor + '; font-family: ' + this.properties.textPanelFont + '; font-size: ' + this.properties.textPanelFontSize + '; text-align: ' + this.properties.textPanelAlign + ' \'><span style="padding: 8px">' + content + '</span></div>';
            }
          }
          html += '</div>';
        }
      });
    }
    html += '</div>';
    this.domElement.innerHTML = html;

    this.renderContents();
  }

  private renderContents(): void {

    if (($ as any)('#' + this.guid + '-bigCarousel') != null) {

      if (this.properties.shadow === true && $.fn.reflect) {
        ($ as any)('#' + this.guid + '-bigCarousel .cover').reflect();
      }

      ($ as any)('#' + this.guid + '-bigCarousel').coverflow(
        {
					easing:			this.properties.easing,
					duration:		this.properties.duration,
					index:			3,
					width:			320,
					height:			240,
					visible:		'density',
          density:		this.properties.density,
					innerOffset:	this.properties.innerOffset,
					innerScale:		this.properties.innerScale,
					selectedCss:	{	opacity: 1	},
					outerCss:		{	opacity: .1	},

					confirm:		() => {

					},

					change:			(event, cover) => {

					}

				}
      );
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
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                PropertyFieldCustomList('items', {
                  label: strings.DataFieldLabel,
                  value: this.properties.items,
                  headerText: "Manage Items",
                  fields: [
                    { id: 'Title', title: 'Title', required: true, type: CustomListFieldType.string },
                    { id: 'Enabled', title: 'Enabled', required: true, type: CustomListFieldType.boolean },
                    { id: 'Picture', title: 'Picture', required: true, type: CustomListFieldType.picture },
                    //{ title: 'Picture', required: true, type: CustomListFieldType.picture },
                    { id: 'Link Url', title: 'Link Url', required: false, type: CustomListFieldType.string, hidden: true },
                    { id: 'Link Text', title: 'Link Text', required: false, type: CustomListFieldType.string, hidden: true }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: "coverflowListField"
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('shadow', {
                  label: strings.Shadow,
                }),
                PropertyPaneDropdown('duration', {
                  label: strings.SpeedFieldLabel,
                  options: [
                    {key: 'slow', text: 'slow'},
                    {key: 'normal', text: 'normal'},
                    {key: 'fast', text: 'fast'}
                  ]
                }),
                PropertyPaneDropdown('easing', {
                  label: strings.Easing,
                  options: [
                    {key: 'swing', text: 'swing'},
                    {key: 'linear', text:'linear'},
                    {key: 'jswing', text:'jswing'},
                    {key: 'easeInQuad', text:'easeInQuad'},
                    {key: 'easeInCubic', text:'easeInCubic'},
                    {key: 'easeInQuart', text:'easeInQuart'},
                    {key: 'easeInQuint', text:'easeInQuint'},
                    {key: 'easeInSine', text:'easeInSine'},
                    {key: 'easeInExpo', text:'easeInExpo'},
                    {key: 'easeInCirc', text:'easeInCirc'},
                    {key: 'easeInElastic', text:'easeInElastic'},
                    {key: 'easeInBack', text:'easeInBack'},
                    {key: 'easeInBounce', text:'easeInBounce'},
                    {key: 'easeOutQuad', text:'easeOutQuad'},
                    {key: 'easeOutCubic', text:'easeOutCubic'},
                    {key: 'easeOutQuart', text:'easeOutQuart'},
                    {key: 'easeOutQuint', text:'easeOutQuint'},
                    {key: 'easeOutSine', text:'easeOutSine'},
                    {key: 'easeOutExpo', text:'easeOutExpo'},
                    {key: 'easeOutCirc', text:'easeOutCirc'},
                    {key: 'easeOutElastic', text:'easeOutElastic'},
                    {key: 'easeOutBack', text:'easeOutBack'},
                    {key: 'easeOutBounce', text:'easeOutBounce'},
                    {key: 'easeInOutQuad', text:'easeInOutQuad'},
                    {key: 'easeInOutCubic', text:'easeInOutCubic'},
                    {key: 'easeInOutQuart', text:'easeInOutQuart'},
                    {key: 'easeInOutQuint', text:'easeInOutQuint'},
                    {key: 'easeInOutSine', text:'easeInOutSine'},
                    {key: 'easeInOutExpo', text:'easeInOutExpo'},
                    {key: 'easeInOutCirc', text:'easeInOutCirc'},
                    {key: 'easeInOutElastic', text:'easeInOutElastic'},
                    {key: 'easeInOutBack', text:'easeInOutBack'},
                    {key: 'easeInOutBounce', text:'easeInOutBounce'}
                  ]
                }),
                PropertyPaneSlider('density', {
                  label: strings.Density,
                  min: 0,
                  max: 4,
                  step: 0.1
                }),
                PropertyPaneSlider('innerOffset', {
                  label: strings.InnerOffset,
                  min: 0,
                  max: 200,
                  step: 1
                }),
                PropertyPaneSlider('innerScale', {
                  label: strings.InnerScale,
                  min: 0,
                  max: 1,
                  step: 0.1
                })
              ]
            }
          ]
        },
        {
            header: {
              description: strings.PropertyPageTextPanel
            },
            groups: [
            {
              groupName: strings.TextPanelGroupName,
              groupFields: [
                PropertyPaneToggle('textPanelEnable', {
                  label: strings.TextPanelEnableFieldLabel
                }),
                PropertyFieldAlignPicker('textPanelAlign', {
                  label: strings.TextPanelAlignFieldLabel,
                  initialValue: this.properties.textPanelAlign,
                  onPropertyChanged: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "coverflowAlignField"
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "coverflowFontField"
                }),
                PropertyFieldFontSizePicker('textPanelFontSize', {
                  label: strings.TextPanelFontSizeFieldLabel,
                  initialValue: this.properties.textPanelFontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "coverflowFontSizeField"
                }),
                PropertyFieldColorPickerMini('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "coverflowFontColorField"
                }),
                PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "coverflowBackgroundColorField"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
