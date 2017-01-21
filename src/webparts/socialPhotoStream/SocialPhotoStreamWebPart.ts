/**
 * @file
 * Social Photo Stream Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'SocialPhotoStreamStrings';
import { ISocialPhotoStreamWebPartProps } from './ISocialPhotoStreamWebPartProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

require('jquery');
import * as $ from 'jquery';

export default class SocialPhotoStreamWebPart extends BaseClientSideWebPart<ISocialPhotoStreamWebPartProps> {

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

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '';//

    html += `
<style>
.socialstream {
  width: 100%;
  margin: 0 auto;
  display: block;
  padding: 0px;
  display: table;
}

.socialstream li {
  width: ${this.properties.width}px;
  height: ${this.properties.height}px;
  list-style: none;
  float: left;
  margin-right: ${this.properties.spacing}px;
  margin-bottom: ${this.properties.spacing}px;
}

.socialstream li img {
  width: ${this.properties.width}px;
  height: ${this.properties.height}px;
}
</style>
    `;

    html +=  '<div id="' + this.guid + '" class="socialstream"></div>';

    this.domElement.innerHTML = html;

     SPComponentLoader.loadScript('//www.jqueryscript.net/demo/jQuery-Plugin-To-Show-Photo-Streams-Form-Social-Networks/socialstream.jquery.js', 'jQuery').then((): void => {
      ($ as any)('#' + this.guid).socialstream({
        socialnetwork: this.properties.network,
        limit: this.properties.limit,
        username: this.properties.userName,
        overlay: this.properties.overlay,
        apikey: false
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('network', {
                  label: strings.network,
                  options: [
                    {key: 'pinterest', text: 'Pinterest'},
                    {key: 'instagram', text: 'Instagram'},
                    {key: 'flickr', text: 'Flickr'},
                    {key: 'picasa', text: 'Picasa'},
                    {key: 'deviantart', text: 'Deviantart'},
                    {key: 'dribbble', text: 'Dribbble'},
                    {key: 'youtube', text: 'Youtube'},
                    {key: 'newsfeed', text: 'Newsfeed'}
                  ]
                }),
                PropertyPaneTextField('userName', {
                  label: strings.userName
                }),
                PropertyPaneSlider('limit', {
                  label: strings.limit,
                  min: 1,
                  max: 100,
                  step: 1
                }),
                PropertyPaneToggle('overlay', {
                  label: strings.overlay
                }),
                PropertyPaneSlider('width', {
                  label: strings.width,
                  min: 1,
                  max: 400,
                  step: 1
                }),
                PropertyPaneSlider('height', {
                  label: strings.height,
                  min: 1,
                  max: 400,
                  step: 1
                }),
                PropertyPaneSlider('spacing', {
                  label: strings.spacing,
                  min: 0,
                  max: 30,
                  step: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
