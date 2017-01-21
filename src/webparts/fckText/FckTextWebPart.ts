/**
 * @file
 * FckText Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

import * as strings from 'fckTextStrings';
import { IFckTextWebPartProps } from './IFckTextWebPartProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

export default class FckTextWebPart extends BaseClientSideWebPart<IFckTextWebPartProps> {

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

    if (this.displayMode == DisplayMode.Edit) {
      //Edit mode
      var html = '';
      html += "<textarea name='" + this.guid + "-editor' id='" + this.guid + "-editor'>" + this.properties.text + "</textarea>";
      this.domElement.innerHTML = html;

      var fMode = 'standard';
      if (this.properties.mode != null)
        fMode = this.properties.mode;
      var ckEditorCdn = '//cdn.ckeditor.com/4.5.11/{0}/ckeditor.js'.replace("{0}", fMode);
      SPComponentLoader.loadScript(ckEditorCdn, 'CKEDITOR').then((CKEDITOR: any): void => {
        if (this.properties.inline == null || this.properties.inline === false)
          CKEDITOR.replace( this.guid + '-editor', {
              skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
          }  );
        else
          CKEDITOR.inline( this.guid + '-editor', {
              skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
          }   );

        for (var i in CKEDITOR.instances) {
          CKEDITOR.instances[i].on('change', (elm?, val?) =>
          {
            //CKEDITOR.instances[i].updateElement();
            elm.sender.updateElement();
            var value = ((document.getElementById(this.guid + '-editor')) as any).value;
            if (this.onPropertyPaneFieldChanged && value != null) {
              this.properties.text = value;
            }
          });
        }
      });
    }
    else {
      //Read Mode
      this.domElement.innerHTML = this.properties.text;
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
