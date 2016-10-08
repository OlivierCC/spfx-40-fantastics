/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';
import { DisplayMode } from '@microsoft/sp-client-base';

import * as strings from 'MarkdownStrings';
import { IMarkdownWebPartProps } from './IMarkdownWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//require('jquery');
//require('jqueryui');

//import * as $ from 'jquery';

export default class MarkdownWebPart extends BaseClientSideWebPart<IMarkdownWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode
      var html = '';
      html += "<div id='epiceditor'></div>";
      this.domElement.innerHTML = html;

      ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/epiceditor/0.2.2/js/epiceditor.js', 'EpicEditor').then((EpicEditor?: any): void => {
        var editor = new EpicEditor({
          //container: this.guid + '-epiceditor',
          basePath: '//cdnjs.cloudflare.com/ajax/libs/epiceditor/0.2.2/'}).load();
      });
    }
    else {
      //Read Mode
      this.domElement.innerHTML = this.properties.text;
    }
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
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('inline', {
                  label: strings.Inline,
                }),
                PropertyPaneDropdown('mode', {
                  label: strings.Mode,
                  options: [
                    {key: 'basic', text: 'basic'},
                    {key: 'standard', text: 'standard'},
                    {key: 'full', text: 'full'}
                  ]
                }),
                PropertyPaneDropdown('theme', {
                  label: strings.Theme,
                  options: [
                    {key: 'kama', text: 'kama'},
                    {key: 'moono', text: 'moono'}
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
