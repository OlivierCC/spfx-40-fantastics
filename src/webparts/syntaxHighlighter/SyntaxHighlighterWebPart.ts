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
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'SyntaxHighlighterStrings';
import { ISyntaxHighlighterWebPartProps } from './ISyntaxHighlighterWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';
import { DisplayMode } from '@microsoft/sp-client-base';

export default class SyntaxHighlighterWebPart extends BaseClientSideWebPart<ISyntaxHighlighterWebPartProps> {

  private scriptLoaded: boolean;
  private SyntaxHighlighter: any;
  private guid: string;
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

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.onSyntaxHighlighterChanged = this.onSyntaxHighlighterChanged.bind(this);

    this.guid = this.getGuid();
    this.scriptLoaded = false;
    ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/shCore.min.css');
  }

  private getBrushPath(alias?: string): string {
    if (alias == null)
      alias = 'js';
    for (var i = 0; i < this.allBrushes.length; i++) {
      if (this.allBrushes[i].key === alias)
        return this.allBrushes[i].text;
    }
    return 'shBrushJScript.js';
  }

  public render(): void {

    if (this.displayMode == DisplayMode.Read) {

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

      var html = "<pre class='brush: " + ((this.properties.language != null) ? this.properties.language : 'js') + "; toolbar: " + toolbar + "; gutter: " + ruler + "; smart-tabs: " + smartTabs + "; auto-links: " + autoLink + "'>" + this.properties.code + "</pre>";
      this.domElement.innerHTML = html;

      var theme = this.properties.theme;
      if (theme == null || theme == '')
        theme = 'shThemeDefault.min.css';
      ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/' + theme);

      if (this.scriptLoaded === false) {
        ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shCore.min.js', 'SyntaxHighlighter').then((SyntaxHighlighter?: any): void => {
          this.SyntaxHighlighter = SyntaxHighlighter;
          this.renderContent();
        });
        this.scriptLoaded = true;
      }
      else {
        this.renderContent();
      }

    }
    else {
      var editHtml = '<textarea id="' + this.guid + '" class="ms-TextField-field" style="width:100%; min-height:600px" onkeyup="" onchange="">' + this.properties.code + '</textarea>';
      this.domElement.innerHTML = editHtml;
      document.getElementById(this.guid).onchange = this.onSyntaxHighlighterChanged;
      document.getElementById(this.guid).onkeyup = this.onSyntaxHighlighterChanged;
    }
  }

  private onSyntaxHighlighterChanged(elm?: any) {
    this.properties.code = elm.currentTarget.value;
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

  private renderContent(): void {
    var brush = this.getBrushPath(this.properties.language);
    ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/' + brush, 'SyntaxHighlighter').then((SyntaxHighlighter?: any): void => {
      this.SyntaxHighlighter.highlight();
    });
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
