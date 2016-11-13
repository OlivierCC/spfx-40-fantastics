/**
 * @file
 * Media Player Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'MediaPlayerStrings';
import { IMediaPlayerWebPartProps } from './IMediaPlayerWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';

export default class MediaPlayerWebPart extends BaseClientSideWebPart<IMediaPlayerWebPartProps> {

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

    ModuleLoader.loadCss('//cdn.plyr.io/2.0.9/plyr.css');
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var html = '';
    if (this.properties.player == 'youtube') {
      html += '<div data-type="youtube" data-video-id="' + this.properties.youtubeVideoId + '"></div>';
    }
    else if (this.properties.player == 'vimeo') {
      html += '<div data-type="vimeo" data-video-id="' + this.properties.vimeoVideoId + '"></div>';
    }
    else if (this.properties.player == 'audio') {
      html += `
        <audio controls>
          <source src="${this.properties.audio}" type="audio/mp3">
        </audio>
      `;
    }
    else if (this.properties.player == 'video') {
      var captions = '';
      for (var i = 0; i < this.properties.html5captions.length; i++) {
        var caption = this.properties.html5captions[i];
        captions += '<track kind="captions" label="' + caption['Title'] + '" src="' + caption['Url'] + '" srclang="' + caption['SrcLen'] + '">';
      }
      html += `
        <video poster="${this.properties.html5cover}" controls>
          <source src="${this.properties.html5video}" type="video/mp4">
          ${captions}
        </video>
      `;
    }
    this.domElement.innerHTML = html;

    ModuleLoader.loadScript('//cdn.plyr.io/2.0.9/plyr.js', 'plyr').then((plyr?: any): void => {
      plyr.setup();
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
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('player', {
                  label: strings.player,
                  options: [
                    {key: 'youtube', text: 'Youtube'},
                    {key: 'vimeo', text: 'Vimeo'},
                    {key: 'video', text: 'HTML5 Video'},
                    {key: 'audio', text: 'HTML5 Audio'},
                  ]
                }),
                PropertyPaneTextField('youtubeVideoId', {
                  label: strings.youtubeVideoId
                }),
                PropertyPaneTextField('vimeoVideoId', {
                  label: strings.vimeoVideoId
                }),
                PropertyPaneTextField('audio', {
                  label: strings.audio
                }),
                PropertyPaneTextField('html5video', {
                  label: strings.html5video
                }),
                PropertyPaneTextField('html5cover', {
                  label: strings.html5cover
                }),
                PropertyFieldCustomList('html5captions', {
                  label: strings.html5captions,
                  value: this.properties.html5captions,
                  headerText: strings.html5captions,
                  fields: [
                    { title: 'Title', required: true, type: CustomListFieldType.string },
                    { title: 'SrcLen', required: false, hidden: false, type: CustomListFieldType.string },
                    { title: 'Url', required: true, hidden: false, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyChanged,
                  context: this.context,
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
