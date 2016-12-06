/**
 * @file
 * Syntax Highlighter Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'SyntaxHighlighterStrings';
import { ISyntaxHighlighterWebPartProps } from './ISyntaxHighlighterWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';
import { DisplayMode } from '@microsoft/sp-client-base';

/**
 * @class
 * Syntax Highlighter Web Part.
 */
export default class SyntaxHighlighterWebPart extends BaseClientSideWebPart<ISyntaxHighlighterWebPartProps> {

  /**
   * @var
   * Boolean to define if the scripts are already loaded or not
   */
  private scriptLoaded: boolean;
  /**
   * @var
   * Syntax Highlighter JS object instance
   */
  private SyntaxHighlighter: any;
  /**
   * @var
   * Unique ID of this Web Part instance
   */
  private guid: string;
  /**
   * @var
   * Collection of brushes (languages) with matching table between alias and JS file
   */
  private allBrushes: any[] = [
                      {key: 'as3', text: 'shBrushAS3.js'},
                      {key: 'bash', text: 'shBrushBash.js'},
                      {key: 'cf', text: '	shBrushColdFusion.js'},
                      {key: 'csharp', text: 'shBrushCSharp.js'},
                      {key: 'cpp', text: 'shBrushCpp.js'},
                      {key: 'css', text: 'shBrushCss.js'},
                      {key: 'delphi', text: '	shBrushDelphi.js'},
                      {key: 'diff', text: 'shBrushDiff.js'},
                      {key: 'erl', text: 'shBrushErlang.js'},
                      {key: 'groovy', text: 'shBrushGroovy.js'},
                      {key: 'js', text: 'shBrushJScript.js'},
                      {key: 'java', text: 'shBrushJava.js'},
                      {key: 'jfx', text: 'shBrushJavaFX.js'},
                      {key: 'perl', text: 'shBrushPerl.js'},
                      {key: 'php', text: 'shBrushPhp.js'},
                      {key: 'plain', text: 'shBrushPlain.js'},
                      {key: 'ps', text: 'shBrushPowerShell.js'},
                      {key: 'py', text: 'shBrushPython.js'},
                      {key: 'rails', text: 'shBrushRuby.js'},
                      {key: 'scala', text: 'shBrushScala.js'},
                      {key: 'sql', text: 'shBrushSql.js'},
                      {key: 'vb', text: 'shBrushVb.js'},
                      {key: 'xml', text: 'shBrushXml.js'}
  ];

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.onSyntaxHighlighterChanged = this.onSyntaxHighlighterChanged.bind(this);

    //Inits the unique ID
    this.guid = this.getGuid();
    this.scriptLoaded = false;

    //Load the SyntaxHighlighter core CSS styles
    ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/shCore.min.css');
  }

  /**
   * @function
   * Get the JS brush path from an alias
   */
  private getBrushPath(alias?: string): string {
    if (alias == null)
      alias = 'js';
    for (var i = 0; i < this.allBrushes.length; i++) {
      if (this.allBrushes[i].key === alias) {
        //Brushes found, return it
        return this.allBrushes[i].text;
      }
    }
    //By default, returns JS brush path
    return 'shBrushJScript.js';
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

      //Loads the CSS Style for the selected Theme from cloudfare CDN
      var theme = this.properties.theme;
      if (theme == null || theme == '')
        theme = 'shThemeDefault.min.css';
      ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/' + theme);

      //Checks if the scripts has been already loaded
      if (this.scriptLoaded === false) {
        //If not, load the SyntaxHightligter core JS lib from CDN
        ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shCore.min.js', 'SyntaxHighlighter').then((SyntaxHighlighter?: any): void => {
          //Saves the SyntaxHighlighter object instance
          this.SyntaxHighlighter = SyntaxHighlighter;
          //Calls the render JS method
          this.renderContent();
        });
        this.scriptLoaded = true;
      }
      else {
        //Only calls the render
        this.renderContent();
      }

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
   * JavaScript SyntaxHighlighter render
   */
  private renderContent(): void {
    //Gets the selected brush from current selected language
    var brush = this.getBrushPath(this.properties.language);
    //Loads the SyntaxHighlighter brush JavaScript lib from CDN
    ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/' + brush, 'SyntaxHighlighter').then((SyntaxHighlighter?: any): void => {
      //Calls the SyntaxHighlighter highlight method
      this.SyntaxHighlighter.highlight();
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
                  PropertyPaneDropdown('theme', {
                    label: strings.Theme,
                    options: [
                      {key: 'shThemeDefault.min.css', text: 'Default'},
                      {key: 'shThemeDjango.min.css', text: 'Django'},
                      {key: 'shThemeEclipse.min.css', text: 'Eclipse'},
                      {key: 'shThemeEmacs.min.css', text: 'Emacs'},
                      {key: 'shThemeFadeToGrey.min.css', text: 'Fade to Grey'},
                      {key: 'shThemeMDUltra.min.css', text: 'MD Ultra'},
                      {key: 'shThemeMidnight.min.css', text: 'Midnight'},
                      {key: 'shThemeRDark.min.css', text: 'RDark'}
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
