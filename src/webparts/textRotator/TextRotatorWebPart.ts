/**
 * @file
 * Text Rotator Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'TextRotatorStrings';
import { ITextRotatorWebPartProps } from './ITextRotatorWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

//Loads external JS lib
import * as $ from 'jquery';
require('morphext');

//Loads CSS
require('../../css/animate/animate.scss');
require('../../css/morphext/morphext.scss');

export default class TextRotatorWebPart extends BaseClientSideWebPart<ITextRotatorWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);

    this.guid = this.getGuid();
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

    var style = "style='";
    if (this.properties.align != null)
      style += "text-align: " + this.properties.align + ";";
    if (this.properties.font != null)
      style += "font-family: " + this.properties.font + ';';
    if (this.properties.fontSize != null)
      style += "font-size: " + this.properties.fontSize + ';';
    if (this.properties.fontColor != null)
      style += "color: " + this.properties.fontColor  + ';';
    if (this.properties.backgroundColor != null)
      style += "background-color: " + this.properties.backgroundColor  + ';';
    style += "'";
    var html = "<div " + style + " id='" + this.guid + "-TextRotator'>" + this.properties.text + "</div>";
    this.domElement.innerHTML = html;

    this.renderContent();
  }

  private renderContent(): void {
    ($ as any)('#' + this.guid + "-TextRotator").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: this.properties.effect,
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: "\n",
        // The delay between the changing of each phrase in milliseconds.
        speed: this.properties.duration,
        complete: () => {
            // Called after the entrance animation is executed.
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
                PropertyPaneTextField('text', {
                  label: strings.Text,
                  multiline: true
                }),
                PropertyPaneDropdown('effect', {
                  label: strings.Effet,
                  options: [
                    {key: 'bounce', text: "bounce"},
                    {key: 'flash', text: "flash"},
                    {key: 'pulse', text: "pulse"},
                    {key: 'rubberBand', text: "rubberBand"},
                    {key: 'shake', text: "shake"},
                    {key: 'headShake', text: "headShake"},
                    {key: 'swing', text: "swing"},
                    {key: 'tada', text: "tada"},
                    {key: 'wobble', text: "wobble"},
                    {key: 'jello', text: "jello"},
                    {key: 'bounceIn', text: "bounceIn"},
                    {key: 'bounceInDown', text: "bounceInDown"},
                    {key: 'bounceInLeft', text: "bounceInLeft"},
                    {key: 'bounceInRight', text: "bounceInRight"},
                    {key: 'bounceInUp', text: "bounceInUp"},
                    {key: 'bounceOut', text: "bounceOut"},
                    {key: 'bounceOutDown', text: "bounceOutDown"},
                    {key: 'bounceOutLeft', text: "bounceOutLeft"},
                    {key: 'bounceOutRight', text: "bounceOutRight"},
                    {key: 'bounceOutUp', text: "bounceOutUp"},
                    {key: 'fadeIn', text: "fadeIn"},
                    {key: 'fadeInDown', text: "fadeInDown"},
                    {key: 'fadeInDownBig', text: "fadeInDownBig"},
                    {key: 'fadeInLeft', text: "fadeInLeft"},
                    {key: 'fadeInLeftBig', text: "fadeInLeftBig"},
                    {key: 'fadeInRight', text: "fadeInRight"},
                    {key: 'fadeInRightBig', text: "fadeInRightBig"},
                    {key: 'fadeInUp', text: "fadeInUp"},
                    {key: 'fadeInUpBig', text: "fadeInUpBig"},
                    {key: 'fadeOut', text: "fadeOut"},
                    {key: 'fadeOutDown', text: "fadeOutDown"},
                    {key: 'fadeOutDownBig', text: "fadeOutDownBig"},
                    {key: 'fadeOutLeft', text: "fadeOutLeft"},
                    {key: 'fadeOutLeftBig', text: "fadeOutLeftBig"},
                    {key: 'fadeOutRight', text: "fadeOutRight"},
                    {key: 'fadeOutRightBig', text: "fadeOutRightBig"},
                    {key: 'fadeOutUp', text: "fadeOutUp"},
                    {key: 'fadeOutUpBig', text: "fadeOutUpBig"},
                    {key: 'flipInX', text: "flipInX"},
                    {key: 'flipInY', text: "flipInY"},
                    {key: 'flipOutX', text: "flipOutX"},
                    {key: 'flipOutY', text: "flipOutY"},
                    {key: 'lightSpeedIn', text: "lightSpeedIn"},
                    {key: 'lightSpeedOut', text: "lightSpeedOut"},
                    {key: 'rotateIn', text: "rotateIn"},
                    {key: 'rotateInDownLeft', text: "rotateInDownLeft"},
                    {key: 'rotateInDownRight', text: "rotateInDownRight"},
                    {key: 'rotateInUpLeft', text: "rotateInUpLeft"},
                    {key: 'rotateInUpRight', text: "rotateInUpRight"},
                    {key: 'rotateOut', text: "rotateOut"},
                    {key: 'rotateOutDownLeft', text: "rotateOutDownLeft"},
                    {key: 'rotateOutDownRight', text: "rotateOutDownRight"},
                    {key: 'rotateOutUpLeft', text: "rotateOutUpLeft"},
                    {key: 'rotateOutUpRight', text: "rotateOutUpRight"},
                    {key: 'hinge', text: "hinge"},
                    {key: 'rollIn', text: "rollIn"},
                    {key: 'rollOut', text: "rollOut"},
                    {key: 'zoomIn', text: "zoomIn"},
                    {key: 'zoomInDown', text: "zoomInDown"},
                    {key: 'zoomInLeft', text: "zoomInLeft"},
                    {key: 'zoomInRight', text: "zoomInRight"},
                    {key: 'zoomInUp', text: "zoomInUp"},
                    {key: 'zoomOut', text: "zoomOut"},
                    {key: 'zoomOutDown', text: "zoomOutDown"},
                    {key: 'zoomOutLeft', text: "zoomOutLeft"},
                    {key: 'zoomOutRight', text: "zoomOutRight"},
                    {key: 'zoomOutUp', text: "zoomOutUp"},
                    {key: 'slideInDown', text: "slideInDown"},
                    {key: 'slideInLeft', text: "slideInLeft"},
                    {key: 'slideInRight', text: "slideInRight"},
                    {key: 'slideInUp', text: "slideInUp"},
                    {key: 'slideOutDown', text: "slideOutDown"},
                    {key: 'slideOutLeft', text: "slideOutLeft"},
                    {key: 'slideOutRight', text: "slideOutRight"},
                    {key: 'slideOutUp', text: "slideOutUp"}
                  ]
                }),
                PropertyPaneSlider('duration', {
                  label: strings.Duration,
                  min: 0,
                  max: 5000,
                  step: 100
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyFieldAlignPicker('align', {
                  label: strings.Align,
                  initialValue: this.properties.align,
                  onPropertyChanged: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'textRotatorAlignField'
                }),
                PropertyFieldFontPicker('font', {
                  label: strings.Font,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'textRotatorFontField'
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.fontSize,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'textRotatorFontSizeField'
                }),
                PropertyFieldColorPickerMini('fontColor', {
                  label: strings.FontColor,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'textRotatorFontColorField'
                }),
                PropertyFieldColorPickerMini('backgroundColor', {
                  label: strings.BackgroundColor,
                  initialColor: this.properties.backgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'textRotatorBgColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
