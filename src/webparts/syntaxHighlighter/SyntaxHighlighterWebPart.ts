/**
 * @file
 * Syntax Highlighter Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'SyntaxHighlighterStrings';
import { ISyntaxHighlighterWebPartProps } from './ISyntaxHighlighterWebPartProps';
import { DisplayMode, Version } from '@microsoft/sp-core-library';

//Loads external CSS
require('../../css/syntaxHighlighter/shCore.min.scss');
require('../../css/syntaxHighlighter/shThemeDefault.min.scss');

//Loads external JS files
var SyntaxHighlighter: any = require('syntaxHighlighter');
require('shBrushAS3');
require('shBrushBash');
require('shBrushColdFusion');
require('shBrushCpp');
require('shBrushCSharp');
require('shBrushCss');
require('shBrushDelphi');
require('shBrushDiff');
require('shBrushErlang');
require('shBrushGroovy');
require('shBrushJava');
require('shBrushJavaFX');
require('shBrushJScript');
require('shBrushPerl');
require('shBrushPhp');
require('shBrushPlain');
require('shBrushPowerShell');
require('shBrushPython');
require('shBrushRuby');
require('shBrushScala');
require('shBrushSql');
require('shBrushVb');
require('shBrushXml');

/**
 * @class
 * Syntax Highlighter Web Part.
 */
export default class SyntaxHighlighterWebPart extends BaseClientSideWebPart<ISyntaxHighlighterWebPartProps> {

  /**
   * @var
   * Unique ID of this Web Part instance
   */
  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
    this.onSyntaxHighlighterChanged = this.onSyntaxHighlighterChanged.bind(this);

    //Inits the unique ID
    this.guid = this.getGuid();
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

    //Checks the Web Part display mode
    if (this.displayMode == DisplayMode.Read) {
      //Read mode -> show the code with SyntaxHighlighter lib
      var toolbar = true;
      if (this.properties.toolbar != null)
        toolbar = this.properties.toolbar;
      var ruler = true;
      if (this.properties.gutter != null)
        ruler = this.properties.gutter;
      var autoLink = true;
      if (this.properties.autoLinks != null)
        autoLink = this.properties.autoLinks;
      var smartTabs = true;
      if (this.properties.smartTabs != null)
        smartTabs = this.properties.smartTabs;

      //Creates the <pre> HTML code
      var html = "<pre class='brush: " + ((this.properties.language != null) ? this.properties.language : 'js') + "; toolbar: " + toolbar + "; gutter: " + ruler + "; smart-tabs: " + smartTabs + "; auto-links: " + autoLink + "'>" + this.properties.code + "</pre>";
      this.domElement.innerHTML = html;

      SyntaxHighlighter.highlight();
    }
    else {
      //Edit mode -> we only need to generate a textarea and get the changed event
      var editHtml = '<textarea id="' + this.guid + '" class="ms-TextField-field" style="width:100%; min-height:600px" onkeyup="" onchange="">' + this.properties.code + '</textarea>';
      this.domElement.innerHTML = editHtml;
      document.getElementById(this.guid).onchange = this.onSyntaxHighlighterChanged;
      document.getElementById(this.guid).onkeyup = this.onSyntaxHighlighterChanged;
    }
  }

  /**
   * @function
   * Event occurs when the content of the textarea in edit mode is changing.
   */
  private onSyntaxHighlighterChanged(elm?: any) {
    this.properties.code = elm.currentTarget.value;
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
                  PropertyPaneDropdown('language', {
                    label: strings.Language,
                    options: [
                      {key: 'as3', text: 'ActionScript3'},
                      {key: 'bash', text: 'Bash/shell'},
                      {key: 'cf', text: 'ColdFusion'},
                      {key: 'csharp', text: 'C#'},
                      {key: 'cpp', text: 'C++'},
                      {key: 'css', text: 'CSS'},
                      {key: 'delphi', text: 'Delphi'},
                      {key: 'diff', text: 'Diff'},
                      {key: 'erl', text: 'Erlang'},
                      {key: 'groovy', text: 'Groovy'},
                      {key: 'js', text: 'JavaScript'},
                      {key: 'java', text: 'Java'},
                      {key: 'jfx', text: 'JavaFX'},
                      {key: 'perl', text: 'Perl'},
                      {key: 'php', text: 'PHP'},
                      {key: 'plain', text: 'Plain Text'},
                      {key: 'ps', text: 'PowerShell'},
                      {key: 'py', text: 'Python'},
                      {key: 'rails', text: 'Ruby'},
                      {key: 'scala', text: 'Scala'},
                      {key: 'sql', text: 'SQL'},
                      {key: 'vb', text: 'Visual Basic'},
                      {key: 'xml', text: 'XML'}
                    ]
                  }),
                  PropertyPaneToggle('toolbar', {
                    label: strings.Toolbar
                  }),
                  PropertyPaneToggle('gutter', {
                    label: strings.Gutter
                  }),
                  PropertyPaneToggle('autoLinks', {
                    label: strings.AutoLinks
                  }),
                  PropertyPaneToggle('smartTabs', {
                    label: strings.SmartTabs
                  })
              ]
            }
          ]
        }
      ]
    };
  }
}
