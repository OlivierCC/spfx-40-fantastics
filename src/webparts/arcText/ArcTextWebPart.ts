/**
 * @file ArcTextWebPart.ts
 * ArcText JQuery Plugin adaptation as a web part for the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneDropdown
} from '@microsoft/sp-client-preview';

import * as strings from 'arcTextStrings';
import { IArcTextWebPartProps } from './IArcTextWebPartProps';

import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

require('jquery');
require('arctext');

import * as $ from 'jquery';

export default class ArcTextWebPart extends BaseClientSideWebPart<IArcTextWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {
    this.domElement.innerHTML = `<div style='text-align: ${this.properties.align}; font-family: ${this.properties.font}; font-size: ${this.properties.size}; color: ${this.properties.color};'><h3 class="arcText">${this.properties.text}</h3></div>`;
    this.renderContents();
  }

  private renderContents(): void {
    if (($ as any)('.arcText') != null) {
      ($ as any)('.arcText').arctext({
          radius: this.properties.radius,
          rotate: this.properties.rotateLetters,
          dir: this.properties.reverse === true ? -1 : 1
      });
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
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('size', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.size,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('color', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.color,
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
