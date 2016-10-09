/**
 * @file
 * Animated Text Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'CodeStrings';
import { ICodeWebPartProps } from './ICodeWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

export default class CodeWebPart extends BaseClientSideWebPart<ICodeWebPartProps> {

  private guid: string;
  private scriptLoaded: boolean;
  private ace: any;

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);

    this.guid = this.getGuid();
    this.scriptLoaded = false;
  }

  public render(): void {

    var html = "<div id='" + this.guid + "-Code'>Sample content</div>";
    this.domElement.innerHTML = html;

    if (this.renderedOnce === false || this.scriptLoaded === false) {
      ModuleLoader.loadScript('//ace.c9.io/build/src/ace.js', 'ace').then((ace: any): void => {
        ModuleLoader.loadScript('//ace.c9.io/build/src/theme/twilight.js', 'ace').then((): void => {
           ModuleLoader.loadScript('//ace.c9.io/build/src/mode/javascript.js', 'ace').then((): void => {
            this.ace = ace;
            this.renderContent();
          });
        });
      });
      this.scriptLoaded = true;
    }
    else {
      this.renderContent();
    }

  }

  private renderContent(): void {
    //var editor = this.ace.edit(this.guid + "-Code");
    //editor.setTheme("ace/theme/monokai");
    //editor.getSession().setMode("ace/mode/javascript");
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

              ]
            }
          ]
        }
      ]
    };
  }
}
