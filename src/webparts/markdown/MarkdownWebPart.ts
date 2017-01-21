/**
 * @file
 * Markdown Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import * as strings from 'MarkdownStrings';
import { IMarkdownWebPartProps } from './IMarkdownWebPartProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

/**
 * @class
 * Markdown Web Part.
 */
export default class MarkdownWebPart extends BaseClientSideWebPart<IMarkdownWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();

    //Loads the CSS styles of the Markdown editor
    SPComponentLoader.loadCss('//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');
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

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode: build a rich text area specialized in MD edition

      //Creates a textarea container
      var html = '';
      html += "<textarea id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
      this.domElement.innerHTML = html;

      //Loads Simplemde.js from cdn
      SPComponentLoader.loadScript('//cdn.jsdelivr.net/simplemde/latest/simplemde.min.js', 'SimpleMDE').then((SimpleMDE?: any): void => {
        var simplemde;
        if (this.properties.toolbar === false) {
          if (this.properties.status === false) {
            //Creates editor without status bar & toolbar
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbar: this.properties.toolbar,
              toolbarTips: this.properties.toolbarTips,
              status: this.properties.status,
              spellChecker: this.properties.spellChecker
            });
          }
          else {
            //Creates editor with status bar & without toolbar
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
            //Creates editor without status bar & with toolbar
            simplemde = new SimpleMDE({
              element: document.getElementById(this.guid + "-editor"),
              toolbarTips: this.properties.toolbarTips,
              status: this.properties.status,
              spellChecker: this.properties.spellChecker
            });
          }
          else {
            simplemde = new SimpleMDE({
              //Creates editor with status bar & with toolbar
              element: document.getElementById(this.guid + "-editor"),
              toolbarTips: this.properties.toolbarTips,
              spellChecker: this.properties.spellChecker
            });
          }
        }
        simplemde.codemirror.on("change", function(){
          //Function executed when the text change in rich editor
          this.properties.text = simplemde.value();
        }.bind(this));
      });
    }
    else {
      //Read Mode
      //Loads the showdown.js library to render MD code as HTML
      SPComponentLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/showdown/1.4.3/showdown.min.js', 'showdown').then((showdown?: any): void => {
        //Inits the converter
        var converter = new showdown.Converter();
        //Converts MD to HTML
        this.domElement.innerHTML = converter.makeHtml(this.properties.text);
      });
    }
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
