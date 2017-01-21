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
import { SPComponentLoader } from '@microsoft/sp-loader';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

export default class DockMenuWebPart extends BaseClientSideWebPart<IDockMenuWebPartProps> {

  private guid: string;
  private jQuery: any;

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

    var html = '';

    html += `
    <style>
			.coverflow {
				height: 100px;
				border-bottom: solid 2px black;
			}

			.coverflow .cover {
				width: 100px;
				height: 100px;
				cursor: pointer;
				font-size: 500%;
				border: solid 2px black;
				text-align: center;

				background: #e2e2e2; /* Old browsers */
				/* IE9 SVG, needs conditional override of 'filter' to 'none' */
				background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2UyZTJlMiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2RiZGJkYiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iI2QxZDFkMSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZWZlZmUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
				background: -moz-linear-gradient(top,  #e2e2e2 0%, #dbdbdb 50%, #d1d1d1 51%, #fefefe 100%); /* FF3.6+ */
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#e2e2e2), color-stop(50%,#dbdbdb), color-stop(51%,#d1d1d1), color-stop(100%,#fefefe)); /* Chrome,Safari4+ */
				background: -webkit-linear-gradient(top,  #e2e2e2 0%,#dbdbdb 50%,#d1d1d1 51%,#fefefe 100%); /* Chrome10+,Safari5.1+ */
				background: -o-linear-gradient(top,  #e2e2e2 0%,#dbdbdb 50%,#d1d1d1 51%,#fefefe 100%); /* Opera 11.10+ */
				background: -ms-linear-gradient(top,  #e2e2e2 0%,#dbdbdb 50%,#d1d1d1 51%,#fefefe 100%); /* IE10+ */
				background: linear-gradient(to bottom,  #e2e2e2 0%,#dbdbdb 50%,#d1d1d1 51%,#fefefe 100%); /* W3C */
				filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e2e2e2', endColorstr='#fefefe',GradientType=0 ); /* IE6-8 */
			}

			.coverflow .cover.current {
				opacity: 1;
				border-bottom: none;

				box-shadow:	0 0 16px rgba(0,0,0,.5);

				background: #ffffff; /* Old browsers */
				/* IE9 SVG, needs conditional override of 'filter' to 'none' */
				background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2YzZjNmMyIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iI2VkZWRlZCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
				background: -moz-linear-gradient(top,  #ffffff 0%, #f3f3f3 50%, #ededed 51%, #ffffff 100%); /* FF3.6+ */
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(50%,#f3f3f3), color-stop(51%,#ededed), color-stop(100%,#ffffff)); /* Chrome,Safari4+ */
				background: -webkit-linear-gradient(top,  #ffffff 0%,#f3f3f3 50%,#ededed 51%,#ffffff 100%); /* Chrome10+,Safari5.1+ */
				background: -o-linear-gradient(top,  #ffffff 0%,#f3f3f3 50%,#ededed 51%,#ffffff 100%); /* Opera 11.10+ */
				background: -ms-linear-gradient(top,  #ffffff 0%,#f3f3f3 50%,#ededed 51%,#ffffff 100%); /* IE10+ */
				background: linear-gradient(to bottom,  #ffffff 0%,#f3f3f3 50%,#ededed 51%,#ffffff 100%); /* W3C */
				filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-8 */
			}
			.coverflow .cover.current:after {
				content:			' ';
				background-color:	white;
				display:			block;
				position:			absolute;
				width:				132px;
				height:				16px;
				left:				-16px;
				bottom:				-16px;
			}

			/* CD covers */
			.photos .cover {
				cursor: pointer;
				/*-webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(50%, transparent), to(rgba(255, 255, 255, .5)));*/
			}

			#photos-info {
				position:		relative;
				text-align:		center;
				z-index:		1000;
				text-shadow:	0 0 8px white;
			}

			#photos-name {
				font-size: 200%;
				font-weight: bold;
			}

			.clearfix {
				clear: both;
			}
		</style>
    `;

    html += '<div class="photos" style="position: relative; width: 100%;" id="' + this.guid + '-bigCarousel">';


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

    if (this.renderedOnce === false) {
      SPComponentLoader.loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.js', 'jQuery').then((jQuery: any): void => {
        this.jQuery = jQuery;
        SPComponentLoader.loadScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.js', 'jQuery').then((): void => {
          SPComponentLoader.loadScript('//vanderlee.github.io/coverflow/jquery.coverflow.js', 'jQuery').then((): void => {
            SPComponentLoader.loadScript('//vanderlee.github.io/coverflow/jquery.interpolate.min.js', 'jQuery').then((): void => {
              SPComponentLoader.loadScript('//vanderlee.github.io/coverflow/jquery.touchSwipe.min.js', 'jQuery').then((): void => {
                SPComponentLoader.loadScript('//vanderlee.github.io/coverflow/reflection.js', 'jQuery').then((): void => {
                  this.renderContents();
                });
              });
            });
          });
        });
      });
    }
    else {
      this.renderContents();
    }
  }

  private renderContents(): void {

    if ((this.jQuery as any)('#' + this.guid + '-bigCarousel') != null) {

      if (this.properties.shadow === true && this.jQuery.fn.reflect) {
        (this.jQuery as any)('#' + this.guid + '-bigCarousel .cover').reflect();
      }

      (this.jQuery as any)('#' + this.guid + '-bigCarousel').coverflow(
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
                    { title: 'Title', required: true, type: CustomListFieldType.string },
                    { title: 'Enabled', required: true, type: CustomListFieldType.boolean },
                    { title: 'Picture', required: true, type: CustomListFieldType.string },
                    //{ title: 'Picture', required: true, type: CustomListFieldType.picture },
                    { title: 'Link Url', required: false, type: CustomListFieldType.string, hidden: true },
                    { title: 'Link Text', required: false, type: CustomListFieldType.string, hidden: true }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context,
                  properties: this.properties
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
                  properties: this.properties
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('textPanelFontSize', {
                  label: strings.TextPanelFontSizeFieldLabel,
                  initialValue: this.properties.textPanelFontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
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
