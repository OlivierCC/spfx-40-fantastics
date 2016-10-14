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
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-client-preview';
import { DisplayMode } from '@microsoft/sp-client-base';
import ModuleLoader from '@microsoft/sp-module-loader';

import * as strings from 'AccordionStrings';
import { IAccordionWebPartProps } from './IAccordionWebPartProps';
import importableModuleLoader from '@microsoft/sp-module-loader';

import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
//import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';

require('jquery');
require('jqueryui');

import * as $ from 'jquery';

export default class AccordionWebPart extends BaseClientSideWebPart<IAccordionWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);

    importableModuleLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
  }

  public render(): void {

    var html = '';

    html += '<div class="accordion">';

    this.properties.tabs.map((tab: any, index: number) => {
      if (this.displayMode == DisplayMode.Edit) {
        html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
        html += '<div style="min-height: 400px"><textarea name="' + this.guid + '-editor-' + index + '" id="' + this.guid + '-editor-' + index + '">' + (tab.Content != null ? tab.Content : '') + '</textarea></div>';
      }
      else {
        html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
        html += '<div>' + (tab.Content != null ? tab.Content : '') + '</div>';
      }
    });
    html += '</div>';

    this.domElement.innerHTML = html;

    const accordionOptions: JQueryUI.AccordionOptions = {
      animate: this.properties.animate != false ? this.properties.speed : false,
      collapsible: this.properties.collapsible,
      heightStyle: this.properties.heightStyle
    };
    $(this.domElement).children('.accordion').accordion(accordionOptions);

    if (this.displayMode == DisplayMode.Edit) {

        var fMode = 'standard';
        if (this.properties.mode != null)
          fMode = this.properties.mode;
        var ckEditorCdn = '//cdn.ckeditor.com/4.5.11/{0}/ckeditor.js'.replace("{0}", fMode);
        ModuleLoader.loadScript(ckEditorCdn, 'CKEDITOR').then((CKEDITOR: any): void => {
          if (this.properties.inline == null || this.properties.inline === false) {
            for (var tab = 0; tab < this.properties.tabs.length; tab++) {
              CKEDITOR.replace( this.guid + '-editor-' + tab, {
                    skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
              }  );
            }

          }
          else {
            for (var tab2 = 0; tab2 < this.properties.tabs.length; tab2++) {
              CKEDITOR.inline( this.guid + '-editor-' + tab2, {
                    skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
              }   );
            }
          }

          for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].on('change', (elm?, val?) =>
            {
              elm.sender.updateElement();
              var value = ((document.getElementById(elm.sender.name)) as any).value;
              var id = elm.sender.name.split("-editor-")[1];
              this.properties.tabs[id].Content = value;
            });
          }
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
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCustomList('tabs', {
                  label: strings.Accordion,
                  value: this.properties.tabs,
                  headerText: strings.ManageAccordion,
                  fields: [
                    { title: 'Title', required: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                }),
                PropertyPaneToggle('collapsible', {
                  label: strings.Collapsible,
                }),
                PropertyPaneToggle('animate', {
                  label: strings.Animate,
                }),
                PropertyPaneSlider('speed', {
                  label: strings.Speed,
                  min: 0,
                  max: 4000,
                  step: 50
                }),
                PropertyPaneDropdown('heightStyle', {
                  label: strings.HeightStyle,
                  options: [
                    {key: 'auto', text: 'auto'},
                    {key: 'fill', text: 'fill'},
                    {key: 'content', text: 'content'}
                  ]
                })
              ]
            },
            {
              groupName: strings.TextEditorGroupName,
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
