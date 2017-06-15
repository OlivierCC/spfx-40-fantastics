/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'carousel3DStrings';
import { ICarousel3DWebPartProps } from './ICarousel3DWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';

//Loads external JS libs
import * as $ from 'jquery';
require('jqueryreflection');
require('cloud9carousel');

export default class Carousel3DWebPart extends BaseClientSideWebPart<ICarousel3DWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Generates the unique ID
    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);

    //Binds the async method
    this.rendered = this.rendered.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
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

    //Checks if the carousel is already loaded. If yes, desacrivate it
    if (($ as any)('#' + this.guid + '-carousel').data("carousel") != null) {
        ($ as any)('#' + this.guid + '-carousel').data("carousel").deactivate();
        ($ as any)('#' + this.guid + '-carousel').data("carousel").onRendered = null;
    }

    //Defines the main DIV container
    var html = '<div id="' + this.guid + '-bigCarousel" style="height:0px; visibility: hidden"><div id="' + this.guid + '-carousel"> ';
    if (this.properties.items != null) {
      //Browse the items collection
      this.properties.items.map(item => {
        if (item != null && item.Enabled != "false") {
          //Adds a new Carousel entry
          html += '<img class="cloud9-item" style="cursor: pointer" dataText="'+ item['Link Text'] + '" dataUrl="'+ item['Link Url'] + '" src="' + item.Picture + '" height="' + this.properties.itemHeight + '" alt="' + item.Title + '" />';
        }
      });
    }
    html += `
        </div>
       `;
    if (this.properties.showTitle === true) {
      //Shows the title
      html += '<div style=\'font-size: ' + this.properties.fontSize + '; color: ' + this.properties.fontColor + '; font-family:'
        + this.properties.font  + '\'><div id="' + this.guid + '-item-title" style="position: absolute; bottom:0; width: 100%; text-align: center;">&nbsp;</div></div>';
    }
    if (this.properties.showButton === true) {
      //Shows the button to navigate
      html += '<div id="' + this.guid + '-buttons" style="height: 100%">';
      html += `
          <button class="left" style="float:left; height: 60px; position: absolute; top: 45%; cursor: pointer;">
            <i class='ms-Icon ms-Icon--ChevronLeft' aria-hidden="true" style="font-size:large"></i>
          </button>
          <button class="right" style="float:right; height: 60px; position: absolute; top: 45%; margin-right: 10px; right: 0; cursor: pointer;">
            <i class='ms-Icon ms-Icon--ChevronRight' aria-hidden="true" style="font-size:large"></i>
          </button>
        </div>
        `;
     }
     html += `
      </div>
    `;
    this.domElement.innerHTML = html;

    this.renderContents();
  }

  /**
   * @function
   * Renders JavaScript JQuery plugin
   */
  private renderContents(): void {

    if (($ as any)('#' + this.guid + '-carousel') != null) {
      //Calls the jquery carousel init method
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
    }
  }

  /**
   * @function
   * Occurs when the carousel jquery plugin is loaded. So, change the visiblity
   */
  private onLoaded(): void  {
    $("#" + this.guid + "-bigCarousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-bigCarousel").css( 'height', this.properties.height);
    $("#" + this.guid + "-carousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-carousel").css( 'display', 'block' );
    $("#" + this.guid + "-carousel").css( 'overflow', 'visible' );
    $("#" + this.guid + "-carousel").fadeIn( 1500 );
  }

  /**
   * @function
   * Occurs when the carousel is rendered. So, display the item
   */
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
                  key: "carousel3DListField"
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
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "carousel3DFontField"
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.fontSize,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "carousel3DFontSizeField"
                }),
                PropertyFieldColorPickerMini('fontColor', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "carousel3DFontColorField"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
