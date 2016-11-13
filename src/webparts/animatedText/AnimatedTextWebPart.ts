/**
 * @file
 * Animated Text Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'AnimatedTextStrings';
import { IAnimatedTextWebPartProps } from './IAnimatedTextWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//Imports the property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

//Loads JQuery
require('jquery');
import * as $ from 'jquery';

/**
 * @class
 * AnimatedText Web Part
 */
export default class AnimatedTextWebPart extends BaseClientSideWebPart<IAnimatedTextWebPartProps> {

  private guid: string;
  private scriptLoaded: boolean;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChanged = this.onPropertyChanged.bind(this);

    //Inits the WebParts GUID
    this.guid = this.getGuid();
    this.scriptLoaded = false;

    //Loads the LetterFX Jquery plugin CSS file
    ModuleLoader.loadCss('//tuxsudo.com/letterfx/letterfx.css');
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    //Defines the main DIV container
    var style = "style='padding: 5px;";
    if (this.properties.align != null)
      style += "text-align: " + this.properties.align + ';';
    if (this.properties.font != null)
      style += "font-family: " + this.properties.font + ';';
    if (this.properties.fontSize != null)
      style += "font-size: " + this.properties.fontSize + ';';
    if (this.properties.fontColor != null)
      style += "color: " + this.properties.fontColor  + ';';
    if (this.properties.backgroundColor != null)
      style += "background-color: " + this.properties.backgroundColor  + ';';
    style += "'";
    var html = "<div " + style + " id='" + this.guid + "-AnimatedText'>" + this.properties.text + "</div>";
    this.domElement.innerHTML = html;

    if (this.renderedOnce === false || this.scriptLoaded === false) {
      //loads the letterfx.Js plugin from the CDN
      ModuleLoader.loadScript('//tuxsudo.com/letterfx/letterfx.js', 'jQuery').then((): void => {
        this.renderContent();
      });
      this.scriptLoaded = true;
    }
    else {
      this.renderContent();
    }

  }

  /**
   * @function
   * Renders Javascript content
   */
  private renderContent(): void {
    //Calls the LetterFX JQuery plugin init method with properties
    ($ as any)('#' + this.guid + "-AnimatedText").letterfx({
      "fx": this.properties.effect != null ? this.properties.effect : "spin",
      "backwards": this.properties.effectDirection == "backwards" ? true : false,
      "timing":  this.properties.timing != null ? this.properties.timing : 50,
      "fx_duration": this.properties.duration != null ? this.properties.duration + "ms" : "1000ms",
      "letter_end": this.properties.letterEnd != null ? this.properties.letterEnd : "restore",
      "element_end": this.properties.elementEnd != null ? this.properties.elementEnd : "restore"
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
                    {key: 'spin', text: 'spin'},
                    {key: 'fade', text: 'fade'},
                    {key: 'grow', text: 'grow'},
                    {key: 'smear', text: 'smear'},
                    {key: 'fall', text: 'fall'},
                    {key: 'swirl', text: 'swirl'},
                    {key: 'wave', text: 'wave'},
                    {key: 'fly-top', text: 'fly-top'},
                    {key: 'fly-bottom', text: 'fly-bottom'},
                    {key: 'fly-left', text: 'fly-left'},
                    {key: 'fly-right', text: 'fly-right'}
                  ]
                }),
                PropertyPaneDropdown('effectDirection', {
                  label: strings.Direction,
                  options: [
                    {key: 'forward', text: 'forward'},
                    {key: 'backwards', text: 'backwards'}
                  ]
                }),
                PropertyPaneSlider('timing', {
                  label: strings.Timing,
                  min: 0,
                  max: 100,
                  step: 1
                }),
                PropertyPaneSlider('duration', {
                  label: strings.Duration,
                  min: 0,
                  max: 2000,
                  step: 50
                }),
                PropertyPaneDropdown('letterEnd', {
                  label: strings.LetterEnd,
                  options: [
                    {key: 'restore', text: 'restore'},
                    {key: 'stay', text: 'stay'},
                    {key: 'destroy', text: 'destroy'},
                    {key: 'rewind', text: 'rewind'}
                  ]
                }),
                PropertyPaneDropdown('elementEnd', {
                  label: strings.ElementEnd,
                  options: [
                    {key: 'restore', text: 'restore'},
                    {key: 'stay', text: 'stay'},
                    {key: 'destroy', text: 'destroy'}
                  ]
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyFieldAlignPicker('align', {
                  label: strings.Align,
                  initialValue: this.properties.align,
                  onPropertyChanged: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldFontPicker('font', {
                  label: strings.Font,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.fontSize,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('fontColor', {
                  label: strings.FontColor,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('backgroundColor', {
                  label: strings.BackgroundColor,
                  initialColor: this.properties.backgroundColor,
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
