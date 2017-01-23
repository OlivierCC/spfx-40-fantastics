/**
 * @file
 * Accordion Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as strings from 'AccordionStrings';
import { IAccordionWebPartProps } from './IAccordionWebPartProps';

import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';

//Loads JQuery & JQuery UI
require('jquery');
require('jqueryui');
import * as $ from 'jquery';
import * as JQueryUI from 'jqueryui';

/**
 * @class
 * Accordion Web part
 */
export default class AccordionWebPart extends BaseClientSideWebPart<IAccordionWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Initialize unique GUID
    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);

    //Load the JQuery smoothness CSS file
    SPComponentLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
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

    var html = '';

    //Define the main div
    html += '<div class="accordion" id="' + this.guid + '">';

    //Iterates on tabs
    this.properties.tabs.map((tab: any, index: number) => {
      if (this.displayMode == DisplayMode.Edit) {
        //If diplay Mode is edit, include the textarea to edit the tab's content
        html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
        html += '<div style="min-height: 400px"><textarea name="' + this.guid + '-editor-' + index + '" id="' + this.guid + '-editor-' + index + '">' + (tab.Content != null ? tab.Content : '') + '</textarea></div>';
      }
      else {
        //Display Mode only, so display the tab content
        html += '<h3>' + (tab.Title != null ? tab.Title : '') + '</h3>';
        html += '<div>' + (tab.Content != null ? tab.Content : '') + '</div>';
      }
    });
    html += '</div>';

    //Flush the output HTML code
    this.domElement.innerHTML = html;

    //Inits JQuery UI accordion options
    const accordionOptions: JQueryUI.AccordionOptions = {
      animate: this.properties.animate != false ? this.properties.speed : false,
      collapsible: this.properties.collapsible,
      heightStyle: this.properties.heightStyle
    };
    //Call the JQuery UI accordion plugin on main div
    $('#' + this.guid).accordion(accordionOptions);

    if (this.displayMode == DisplayMode.Edit) {
        //If the display mode is Edit, loads the CK Editor plugin
        var fMode = 'standard';
        if (this.properties.mode != null)
          fMode = this.properties.mode;
        var ckEditorCdn = '//cdn.ckeditor.com/4.5.11/{0}/ckeditor.js'.replace("{0}", fMode);
        //Loads the Javascript from the CKEditor CDN
        SPComponentLoader.loadScript(ckEditorCdn, { globalExportsName: 'CKEDITOR' }).then((CKEDITOR: any): void => {
          if (this.properties.inline == null || this.properties.inline === false) {
            //If mode is not inline, loads the script with the replace method
            for (var tab = 0; tab < this.properties.tabs.length; tab++) {
              CKEDITOR.replace( this.guid + '-editor-' + tab, {
                    skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
              });
            }

          }
          else {
            //Mode is inline, so loads the script with the inline method
            for (var tab2 = 0; tab2 < this.properties.tabs.length; tab2++) {
              CKEDITOR.inline( this.guid + '-editor-' + tab2, {
                    skin: 'kama,//cdn.ckeditor.com/4.4.3/full-all/skins/' + this.properties.theme + '/'
              });
            }
          }
          //Catch the CKEditor instances change event to save the content
          for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].on('change', (elm?, val?) =>
            {
              //Updates the textarea
              elm.sender.updateElement();
              //Gets the value
              var value = ((document.getElementById(elm.sender.name)) as any).value;
              var id = elm.sender.name.split("-editor-")[1];
              //Save the content in properties
              this.properties.tabs[id].Content = value;
            });
          }
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
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
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
