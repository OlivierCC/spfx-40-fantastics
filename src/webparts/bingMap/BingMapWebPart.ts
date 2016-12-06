/**
 * @file
 * Bing Map Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneLink,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'BingMapStrings';
import { IBingMapWebPartProps } from './IBingMapWebPartProps';

//Imports the property pane custom fields
import { PropertyFieldMapPicker } from 'sp-client-custom-fields/lib/PropertyFieldMapPicker';

//Loads JQuery end Bingmap.js lib
require('jquery');
import * as $ from 'jquery';
require('bingmap');

/**
 * @class
 * Bing Map Web Part
 */
export default class BingMapWebPart extends BaseClientSideWebPart<IBingMapWebPartProps> {

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
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    //Inits the main div container
    var html = '<div id="' + this.guid + '"></div>';
    this.domElement.innerHTML = html;

    //Calls the Bingmap.js JQuery plugin init method
    ($ as any)("#" + this.guid).BingMap({
        Height: this.properties.height,
        Width: this.properties.width,
        Latitude: this.properties.position != null ? this.properties.position.substr(this.properties.position.indexOf(",") + 1, this.properties.position.length - this.properties.position.indexOf(",")) : '0',
        Longitude: this.properties.position != null ? this.properties.position.substr(0, this.properties.position.indexOf(",")) : '0',
        Address: this.properties.address,
        Title: this.properties.title,
        Description: this.properties.description,
        APIKEY: this.properties.api,
        ZoomLevel: this.properties.zoomLevel,
        MapMode: this.properties.mapMode,
        MapStyle: this.properties.mapStyle,
        DashBoardStyle: this.properties.dashBoardStyle,
        AllowMouseWheelZoom: this.properties.allowMouseWheelZoom,
        PushPin: this.properties.pushPin,
        ShowDashBoard: this.properties.showDashBoard,
        ShowScaleBar: this.properties.showScaleBar
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
                PropertyPaneTextField('api', {
                  label: strings.Api
                }),
                PropertyPaneLink('bingLink', {
                  text: strings.Register,
                  href: 'http://www.bingmapsportal.com/',
                  target: '_blank'
                })
              ]
            },
            {
              groupName: strings.LocationGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.Title
                }),
                PropertyPaneTextField('description', {
                  label: strings.Description
                }),
                PropertyPaneTextField('address', {
                  label: strings.Address
                }),
                PropertyFieldMapPicker('position', {
                  label: strings.Position,
                  longitude: this.properties.position != null ? this.properties.position.substr(0, this.properties.position.indexOf(",")) : '0',
                  latitude: this.properties.position != null ? this.properties.position.substr(this.properties.position.indexOf(",") + 1, this.properties.position.length - this.properties.position.indexOf(",")) : '0',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            },
            {
              groupName: strings.MapGroupName,
              groupFields: [
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
                }),
                PropertyPaneSlider('zoomLevel', {
                  label: strings.ZoomLevel,
                  min: 1,
                  max: 19,
                  step: 1
                }),
                PropertyPaneDropdown('mapMode', {
                  label: strings.MapMode,
                  options: [
                    { key: '2D', text: '2D'},
                    { key: '3D', text: '3D'}
                  ]
                }),
                PropertyPaneDropdown('mapStyle', {
                  label: strings.MapStyle,
                  options: [
                    { key: 'Aerial', text: 'Aerial'},
                    { key: 'Birdseye', text: 'Birdseye'},
                    { key: 'Road', text: 'Road'},
                    { key: 'Hybrid', text: 'Hybrid'}
                  ]
                }),
                PropertyPaneToggle('pushPin', {
                  label: strings.PushPin
                }),
                PropertyPaneToggle('showDashBoard', {
                  label: strings.ShowDashBoard
                }),
                PropertyPaneDropdown('dashBoardStyle', {
                  label: strings.DashBoardStyle,
                  options: [
                    { key: 'Normal', text: 'Normal'},
                    { key: 'Small', text: 'Small'},
                    { key: 'Tiny', text: 'Tiny'}
                  ]
                }),
                PropertyPaneToggle('showScaleBar', {
                  label: strings.ShowScaleBar
                }),
                PropertyPaneToggle('allowMouseWheelZoom', {
                  label: strings.AllowMouseWheelZoom
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
