/**
 * @file
 * Radar Chart Web Part for SharePoint Framework SPFx
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
} from '@microsoft/sp-webpart-base';

import * as strings from 'RadarChartStrings';
import { IRadarChartWebPartProps } from './IRadarChartWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';

export default class RadarChartWebPart extends BaseClientSideWebPart<IRadarChartWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
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

    var html = '<canvas id="' + this.guid + '" width="' + this.properties.width + '" height="' + this.properties.width + '"></canvas>';
    this.domElement.innerHTML = html;

    ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js', 'Chart').then((Chart?: any): void => {

        var data = {
        labels: this.getDataTab(strings.Label),
        datasets: [
            {
                data: this.getDataTab(strings.Value),
                backgroundColor: this.properties.fillColor,
                pointStyle: this.properties.pointStyle,
                fill: this.properties.fill,
                lineTension: this.properties.lineTension,
                showLine: this.properties.showLine,
                pointRadius: 2,
                steppedLine: this.properties.steppedLine
            }
        ]
      };
      var options = {
        responsive: this.properties.responsive != null ? this.properties.responsive : false,
        title: {
            display: this.properties.titleEnable,
            text: this.properties.title,
            position: this.properties.position,
            fontFamily: this.properties.titleFont != null ? this.properties.titleFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontSize: this.properties.titleSize != null ? Number(this.properties.titleSize.replace("px", "")) : 12,
            fontColor: this.properties.titleColor != null ? this.properties.titleColor : "#666"
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: this.properties.xAxesEnable
            }],
            yAxes: [{
                display: this.properties.yAxesEnable
            }]
        }
        /*
        legend: {
            display: this.properties.legendEnable,
            position: this.properties.legendPosition != null ? this.properties.legendPosition : 'top',
            labels: {
                fontColor: this.properties.legendColor != null ? this.properties.legendColor : "#666",
                fontFamily: this.properties.legendFont != null ? this.properties.legendFont : "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                fontSize: this.properties.legendSize != null ? Number(this.properties.legendSize.replace("px", "")) : 12
            }
        }*/
      };
      var ctx = document.getElementById(this.guid);
      new Chart(ctx, {
          type: 'radar',
          data: data,
          options: options
      });

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
                PropertyFieldCustomList('items', {
                  label: strings.Items,
                  value: this.properties.items,
                  headerText: strings.ManageItems,
                  fields: [
                    { title: strings.Label, required: true, type: CustomListFieldType.string },
                    { title: strings.Value, required: true, type: CustomListFieldType.number }
                  ],
                  onPropertyChange: this.onPropertyChanged,
                  context: this.context,
                  properties: this.properties
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
                PropertyPaneToggle('fill', {
                  label: strings.Fill
                }),
                PropertyPaneToggle('xAxesEnable', {
                  label: strings.XAxesEnable
                }),
                PropertyPaneToggle('yAxesEnable', {
                  label: strings.YAxesEnable
                }),
                PropertyPaneSlider('lineTension', {
                  label: strings.LineTension,
                  min: 0,
                  max: 0.5,
                  step: 0.05
                }),
                PropertyPaneDropdown('pointStyle', {
                  label: strings.PointStyle,
                  options: [
                    {key: 'circle', text: 'circle'},
                    {key: 'triangle', text: 'triangle'},
                    {key: 'rect', text: 'rect'},
                    {key: 'rectRot', text: 'rectRot'},
                    {key: 'cross', text: 'cross'},
                    {key: 'crossRot', text: 'crossRot'},
                    {key: 'star', text: 'star'},
                    {key: 'line', text: 'line'},
                    {key: 'dash', text: 'dash'}
                  ]
                }),
                PropertyFieldColorPicker('fillColor', {
                  label: strings.FillColor,
                  initialColor: this.properties.fillColor,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
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
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('titleSize', {
                  label: strings.TitleSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.titleSize,
                  onPropertyChange: this.onPropertyChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('titleColor', {
                  label: strings.TitleColor,
                  initialColor: this.properties.titleColor,
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
