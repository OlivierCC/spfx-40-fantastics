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
  IWebPartContext,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-client-preview';

import * as strings from 'dockMenuStrings';
import { IDockMenuWebPartProps } from './IDockMenuWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';

//require('jquery');
//require('jqueryui');

//import * as $ from 'jquery';

export default class DockMenuWebPart extends BaseClientSideWebPart<IDockMenuWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
    this.rendered = this.rendered.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

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

    html += '<div class="photos" id="' + this.guid + '-bigCarousel">';
    if (this.properties.items != null) {
      this.properties.items.map(item => {
        if (item != null && item.Enabled != "false") {
          html += '<img class="cover" src="' + item.Picture + '" data-name="' + item.Title + '"/>';
        }
      });
    }
    html += '</div>';
    this.domElement.innerHTML = html;

    if (this.renderedOnce === false) {
      ModuleLoader.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.js', 'jQuery').then((): void => {
        ModuleLoader.loadScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.js', 'jQuery').then((): void => {
          ModuleLoader.loadScript('https://vanderlee.github.io/coverflow/jquery.coverflow.js', 'jQuery').then((): void => {
            ModuleLoader.loadScript('https://vanderlee.github.io/coverflow/jquery.interpolate.min.js', 'jQuery').then((): void => {
              ModuleLoader.loadScript('https://vanderlee.github.io/coverflow/jquery.touchSwipe.min.js', 'jQuery').then((): void => {
                ModuleLoader.loadScript('https://vanderlee.github.io/coverflow/reflection.js', 'jQuery').then((): void => {
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

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }


  private renderContents(): void {

    if (($ as any)('#' + this.guid + '-bigCarousel') != null) {

      ($ as any)('#' + this.guid + '-bigCarousel').coverflow(
        {
					easing:			'easeOutElastic',
					duration:		'slow',
					index:			3,
					width:			320,
					height:			240,
					visible:		'density',
					selectedCss:	{	opacity: 1	},
					outerCss:		{	opacity: .1	},

					confirm:		() => {

					},

					change:			(event, cover) => {

					}

				}
      );
/*
      ($ as any)('#' + this.guid + '-carousel').Cloud9Carousel({
        buttonLeft: $("#" + this.guid + "-buttons > .left"),
        buttonRight: $("#" + this.guid + "-buttons > .right"),
        autoPlay: this.properties.autoPlay === true ? 1 : 0,
        autoPlayDelay: this.properties.autoPlayDelay,
        bringToFront: this.properties.bringToFront,
        speed: this.properties.speed,
        yOrigin: this.properties.yOrigin,
        yRadius: this.properties.yRadius,
        xOrigin: this.properties.xOrigin,
        xRadius: this.properties.xRadius,
        mirror: {
          gap: this.properties.mirrorGap,
          height: this.properties.mirrorHeight,
          opacity: this.properties.mirrorOpacity
        },
        onRendered: this.rendered,
        onLoaded: this.onLoaded,
      });
  */
    }
  }

  private onLoaded(): void  {
    $("#" + this.guid + "-bigCarousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-bigCarousel").css( 'height', this.properties.height);
    $("#" + this.guid + "-carousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-carousel").css( 'display', 'block' );
    $("#" + this.guid + "-carousel").css( 'overflow', 'visible' );
    $("#" + this.guid + "-carousel").fadeIn( 1500 );
  }

  private rendered(carousel: any) {
    if ($('#' + this.guid + '-item-title') != null) {

      var subTitle: string = '';
      subTitle += carousel.nearestItem().element.alt;
      if (carousel.nearestItem().element.children[0].attributes.dataurl) {
        var linkUrl = carousel.nearestItem().element.children[0].attributes.dataurl.value;
        if (linkUrl && linkUrl != '' && linkUrl != 'undefined') {
          subTitle += "&nbsp;<a href='" + linkUrl + "'>";
          var dataText = carousel.nearestItem().element.children[0].attributes.datatext.value;
          if (dataText == null || dataText == '')
            dataText = strings.ReadMore;
          subTitle += dataText;
          subTitle += "</a>";
        }
      }
      $('#' + this.guid + '-item-title').html( subTitle );

      // Fade in based on proximity of the item
      var c = Math.cos((carousel.floatIndex() % 1) * 2 * Math.PI);
      $('#' + this.guid + '-item-title').css('opacity', 0.5 + (0.5 * c));
    }
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
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                }),
                PropertyPaneSlider('itemHeight', {
                  label: strings.ItemHeightFieldLabel,
                  min: 10,
                  max: 400,
                  step: 1,
                  showValue: true
                }),
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider('speed', {
                  label: strings.SpeedFieldLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneToggle('autoPlay', {
                  label: strings.AutoplayFieldLabel
                }),
                PropertyPaneSlider('autoPlayDelay', {
                  label: strings.AutoplayDelayFieldLabel,
                  min: 0,
                  max: 10000,
                  step: 100,
                  showValue: true
                })
              ]
            },
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneSlider('height', {
                  label: strings.HeightFieldLabel,
                  min: 0,
                  max: 800,
                  step: 5,
                  showValue: true
                }),
                PropertyPaneToggle('showTitle', {
                  label: strings.ShowTitleFieldLabel
                }),
                PropertyPaneToggle('showButton', {
                  label: strings.ShowButtonsFieldLabel
                }),
                PropertyPaneToggle('bringToFront', {
                  label: strings.BringtoFrontFieldLabel
                })
              ]
            },
            {
              groupName: strings.MirrorGroupName,
              groupFields: [
                PropertyPaneSlider('mirrorGap', {
                  label: strings.MirrorGapFieldLabel,
                  min: 0,
                  max: 20,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneSlider('mirrorHeight', {
                  label: strings.MirrorHeightFieldLabel,
                  min: 0,
                  max: 1,
                  step: 0.1,
                  showValue: true
                }),
                PropertyPaneSlider('mirrorOpacity', {
                  label: strings.MirrorOpacityFieldLabel,
                  min: 0,
                  max: 1,
                  step: 0.1,
                  showValue: true
                })
              ]
            },
            {
              groupName: strings.OriginGroupName,
              groupFields: [
                PropertyPaneSlider('yOrigin', {
                  label: strings.YOriginFieldLabel,
                  min: 0,
                  max: 200,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneSlider('yRadius', {
                  label: strings.YRadiusFieldLabel,
                  min: 0,
                  max: 200,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneSlider('xOrigin', {
                  label: strings.XOriginFieldLabel,
                  min: 0,
                  max: 700,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneSlider('xRadius', {
                  label: strings.XRadiusFieldLabel,
                  min: 0,
                  max: 700,
                  step: 1,
                  showValue: true
                })
              ]
            },
            {
              groupName: strings.TitleGroupName,
              groupFields: [
                PropertyFieldFontPicker('font', {
                  label: strings.FontFieldLabel,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.fontSize,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('fontColor', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyChange
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
