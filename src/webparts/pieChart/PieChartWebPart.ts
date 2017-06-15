/**
 * @file
 * Pie Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'PieChartStrings';
import { IPieChartWebPartProps } from './IPieChartWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldDimensionPicker } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

var Chart: any = require('chartjs');

export default class PieChartWebPart extends BaseClientSideWebPart<IPieChartWebPartProps> {

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

  private getDataTab(property: string): string[] {
    var res: string[] = [];
    this.properties.items.map((item: any) => {
      res.push(item[property]);
    });
    return  res;
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '<canvas id="' + this.guid + '" width="' + this.properties.dimension.width + '" height="' + this.properties.dimension.height + '"></canvas>';
    this.domElement.innerHTML = html;

        var data = {
        labels: this.getDataTab("Label"),
        datasets: [
            {
                data: this.getDataTab("Value"),
                backgroundColor: this.getDataTab("Color"),
                hoverBackgroundColor: this.getDataTab("Hover Color")
            }
        ]
      };
      var options = {
        responsive: this.properties.responsive != null ? this.properties.responsive : false,
        cutoutPercentage: this.properties.cutoutPercentage != null ? this.properties.cutoutPercentage : 0,
        animation: {
            animateRotate: this.properties.animateRotate,
            animateScale: this.properties.animateScale
        },
        title: {
            display: this.properties.titleEnable,
            text: this.properties.title,
            position: this.properties.position,
            fontFamily: this.properties.titleFont != null ? this.properties.titleFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontSize: this.properties.titleSize != null ? Number(this.properties.titleSize.replace("px", "")) : 12,
            fontColor: this.properties.titleColor != null ? this.properties.titleColor : "#666"
        },
        legend: {
            display: this.properties.legendEnable,
            position: this.properties.legendPosition != null ? this.properties.legendPosition : 'top',
            labels: {
                fontColor: this.properties.legendColor != null ? this.properties.legendColor : "#666",
                fontFamily: this.properties.legendFont != null ? this.properties.legendFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                fontSize: this.properties.legendSize != null ? Number(this.properties.legendSize.replace("px", "")) : 12
            }
        }
      };
      var ctx = document.getElementById(this.guid);
      new Chart(ctx, {
          type: 'pie',
          data: data,
          options: options
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
                PropertyFieldCustomList('items', {
                  label: strings.Items,
                  value: this.properties.items,
                  headerText: strings.ManageItems,
                  fields: [
                    { id: 'Label', title: "Label", required: true, type: CustomListFieldType.string },
                    { id: 'Value', title: "Value", required: true, type: CustomListFieldType.number },
                    { id: 'Color', title: "Color", required: true, type: CustomListFieldType.color },
                    { id: 'Hover Color', title: "Hover Color", required: true, type: CustomListFieldType.color }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'pieChartListField'
                }),
                PropertyPaneToggle('responsive', {
                  label: strings.Responsive,
                }),
                PropertyFieldDimensionPicker('dimension', {
                  label: strings.Dimension,
                  initialValue: this.properties.dimension,
                  preserveRatio: true,
                  preserveRatioEnabled: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  disabled: false,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'pieChartDimensionFieldId'
                })
              ]
            },
            {
              groupName: strings.OptionsGroupName,
              groupFields: [
                PropertyPaneSlider('cutoutPercentage', {
                  label: strings.CutoutPercentage,
                  min: 0,
                  max: 99,
                  step: 1
                }),
                PropertyPaneToggle('animateRotate', {
                  label: strings.AnimateRotate
                }),
                PropertyPaneToggle('animateScale', {
                  label: strings.AnimateScale
                })
              ]
            },
            {
              groupName: strings.TitleGroupName,
              groupFields: [
                PropertyPaneToggle('titleEnable', {
                  label: strings.TitleEnable
                }),
                PropertyPaneTextField('title', {
                  label: strings.Title
                }),
                PropertyPaneDropdown('position', {
                  label: strings.Position,
                  options: [
                    {key: 'top', text: 'top'},
                    {key: 'left', text: 'left'},
                    {key: 'bottom', text: 'bottom'},
                    {key: 'right', text: 'right'}
                  ]
                }),
                PropertyFieldFontPicker('titleFont', {
                  label: strings.TitleFont,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.titleFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartTitleFontField'
                }),
                PropertyFieldFontSizePicker('titleSize', {
                  label: strings.TitleSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.titleSize,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartTitleSizeField'
                }),
                PropertyFieldColorPickerMini('titleColor', {
                  label: strings.TitleColor,
                  initialColor: this.properties.titleColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartTitleColorField'
                })
              ]
            },
            {
              groupName: strings.LegendGroupName,
              groupFields: [
                PropertyPaneToggle('legendEnable', {
                  label: strings.LegendEnable
                }),
                PropertyPaneDropdown('legendPosition', {
                  label: strings.LegendPosition,
                  options: [
                    {key: 'top', text: 'top'},
                    {key: 'left', text: 'left'},
                    {key: 'bottom', text: 'bottom'},
                    {key: 'right', text: 'right'}
                  ]
                }),
                PropertyFieldFontPicker('legendFont', {
                  label: strings.LegendFont,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.legendFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartLegendFontField'
                }),
                PropertyFieldFontSizePicker('legendSize', {
                  label: strings.LegendSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.legendSize,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartLegendSizeField'
                }),
                PropertyFieldColorPickerMini('legendColor', {
                  label: strings.LegendColor,
                  initialColor: this.properties.legendColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'pieChartLegendColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
