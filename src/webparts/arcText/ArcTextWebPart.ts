/**
 * @file ArcTextWebPart.ts
 * ArcText JQuery Plugin adaptation as a web part for the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'arcTextStrings';
import { IArcTextWebPartProps } from './IArcTextWebPartProps';

//Loads the property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

//Loads JQuery & Arctext Javascript libraries
import * as $ from 'jquery';
require('arctext');

/**
 * @class
 * ArcText Web Part
 */
export default class ArcTextWebPart extends BaseClientSideWebPart<IArcTextWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Inits the WebParts GUID
    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
    this.renderContents = this.renderContents.bind(this);
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
    //Defines the main DIV container with output HTML code
    this.domElement.innerHTML = `<div style='text-align: ${this.properties.align}; font-family: ${this.properties.font}; font-size: ${this.properties.size}; color: ${this.properties.color};'><h3 class="arcText" id="${this.guid + '-arc'}">${this.properties.text}</h3></div>`;
    this.renderContents();
  }

  /**
   * @function
   * Renders JavaScript JQuery calls
   */
  private renderContents(): void {
    ($ as any)('#' + this.guid + '-arc').arctext({
        radius: this.properties.radius,
        rotate: this.properties.rotateLetters,
        dir: this.properties.reverse === true ? -1 : 1
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
              groupName: strings.EffectGroupName,
              groupFields: [
                PropertyPaneTextField('text', {
                  label: strings.TextFieldLabel,
                  multiline: false
                }),
                PropertyPaneSlider('radius', {
                  label: strings.RadiusFieldLabel,
                  min: 1,
                  max: 1500,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneToggle('rotateLetters', {
                  label: strings.RotateLetterFieldLabel
                }),
                PropertyPaneToggle('reverse', {
                  label: strings.DirectionFieldLabel
                }),
                PropertyPaneDropdown('align', {
                  label: strings.AlignFieldLabel,
                  options: [
                    { key: 'left', text: strings.AlignLeft },
                    { key: 'center', text: strings.AlignCenter },
                    { key: 'right', text: strings.AlignRight }
                  ]
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
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
                  key: "arcTextFontField"
                }),
                PropertyFieldFontSizePicker('size', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.size,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "arcTextFontSizeField"
                }),
                PropertyFieldColorPicker('color', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.color,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: "arcTextColorField"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
