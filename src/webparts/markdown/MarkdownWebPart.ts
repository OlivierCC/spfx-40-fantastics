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

export default class MarkdownWebPart extends BaseClientSideWebPart<IMarkdownWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();
    ModuleLoader.loadCss('//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');
  }

  public render(): void {

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode
      var html = '';
      html += "<textarea id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
      this.domElement.innerHTML = html;

      ModuleLoader.loadScript('//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', 'SimpleMDE').then((SimpleMDE?: any): void => {
        var simplemde;
        if (this.properties.toolbar === false) {
          if (this.properties.status === false) {
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbar: this.properties.toolbar,
              toolbarTips: this.properties.toolbarTips,
              status: this.properties.status,
              spellChecker: this.properties.spellChecker
            });
          }
          else {
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbar: this.properties.toolbar,
              toolbarTips: this.properties.toolbarTips,
              spellChecker: this.properties.spellChecker
            });
          }
        }
        else {
          if (this.properties.status === false) {
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbarTips: this.properties.toolbarTips,
              status: this.properties.status,
              spellChecker: this.properties.spellChecker
            });
          }
          else {
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbarTips: this.properties.toolbarTips,
              spellChecker: this.properties.spellChecker
            });
          }
        }
        simplemde.codemirror.on("change", function(){
            this.properties.text = simplemde.value();
        }.bind(this));
      });
    }
    else {
      //Read Mode
      ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/showdown/1.4.3/showdown.min.js', 'showdown').then((showdown?: any): void => {
        var converter = new showdown.Converter();
        this.domElement.innerHTML = converter.makeHtml(this.properties.text);
      });
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
                PropertyPaneToggle('toolbar', {
                  label: strings.Toolbar,
                }),
                PropertyPaneToggle('toolbarTips', {
                  label: strings.ToolbarTips,
                }),
                PropertyPaneToggle('status', {
                  label: strings.Status,
                }),
                PropertyPaneToggle('spellChecker', {
                  label: strings.SpellChecker,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
