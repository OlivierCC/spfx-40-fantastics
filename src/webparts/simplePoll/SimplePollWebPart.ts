/**
 * @file SimplePollWebPart.ts
 * Simple Poll Web part for SharePoint Framework SPFx
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'SimplePollStrings';
import { ISimplePollWebPartProps } from './ISimplePollWebPartProps';
import SimplePollWebPartHost from './components/SimplePollWebPartHost';

//Imports property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldSPListPicker, PropertyFieldSPListPickerOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListPicker';

export default class SimplePollWebPart extends BaseClientSideWebPart<ISimplePollWebPartProps> {

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    //Constructs the react element code to JSX
    const element: React.ReactElement<ISimplePollWebPartProps> = React.createElement(SimplePollWebPartHost, {
      surveyList: this.properties.surveyList,
      font: this.properties.font,
      size: this.properties.size,
      color: this.properties.color,
      chartType: this.properties.chartType,
      forceVoteToViewResults: this.properties.forceVoteToViewResults,
      context: this.context
    });

    //Render the dom
    ReactDom.render(element, this.domElement);

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
              groupName: strings.EffectGroupName,
              groupFields: [
                PropertyFieldSPListPicker('surveyList', {
                  label: strings.surveyList,
                  selectedList: this.properties.surveyList,
                  includeHidden: false,
                  baseTemplate: 102,
                  orderBy: PropertyFieldSPListPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                }),
                PropertyPaneDropdown('chartType', {
                  label: strings.chartType,
                  options: [
                    {key: 'pie', text: 'Pie chart'},
                    {key: 'horizontalBar', text: 'Bar chart'}
                  ]
                }),
                PropertyPaneToggle('forceVoteToViewResults', {
                  label: strings.forceVoteToViewResults
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
