/**
 * @file
 * Pie Chart Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'PolarChartStrings';
import { IPolarChartWebPartProps } from './IPolarChartWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

export default class PolarChartWebPart extends BaseClientSideWebPart<IPolarChartWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  private getDataTab(property: string): string[] {
    var res: string[] = [];
    this.properties.items.map((item: any) => {
      res.push(item[property]);
    });
    return  res;
  }

  public render(): void {

    var html = '<canvas id="' + this.guid + '" width="' + this.properties.width + '" height="' + this.properties.width + '"></canvas>';
    this.domElement.innerHTML = html;

    ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js', 'Chart').then((Chart?: any): void => {

        var data = {
        labels: this.getDataTab(strings.Label),
        datasets: [
            {
                data: this.getDataTab(strings.Value),
                backgroundColor: this.getDataTab(strings.Color),
                hoverBackgroundColor: this.getDataTab(strings.HoverColor)
            }
        ]
      };
      var options = {
        responsive: this.properties.responsive != null ? this.properties.responsive : false,
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
          type: 'polarArea',
          data: data,
          options: options
      });

    });


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
                PropertyFieldCustomList('items', {
                  label: strings.Items,
                  value: this.properties.items,
                  headerText: strings.ManageItems,
                  fields: [
                    { title: strings.Label, required: true, type: CustomListFieldType.string },
                    { title: strings.Value, required: true, type: CustomListFieldType.number },
                    { title: strings.Color, required: true, type: CustomListFieldType.color },
                    { title: strings.HoverColor, required: true, type: CustomListFieldType.color }
                  ],
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                }),
                PropertyPaneToggle('responsive', {
                  label: strings.Responsive,
                }),
                PropertyPaneSlider('width', {
                  label: strings.Width,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneSlider('height', {
                  label: strings.Height,
                  min: 1,
                  max: 800,
                  step: 1
                })
              ]
            },
            {
              groupName: strings.OptionsGroupName,
              groupFields: [
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
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('titleSize', {
                  label: strings.TitleSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.titleSize,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('titleColor', {
                  label: strings.TitleColor,
                  initialColor: this.properties.titleColor,
                  onPropertyChange: this.onPropertyChange
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
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('legendSize', {
                  label: strings.LegendSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.legendSize,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('legendColor', {
                  label: strings.LegendColor,
                  initialColor: this.properties.legendColor,
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
