/**
 * @file
 * Tweets Feed Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  IWebPartContext
} from '@microsoft/sp-client-preview';

import * as strings from 'TweetsFeedStrings';
import { ITweetsFeedWebPartProps } from './ITweetsFeedWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';

require('jquery');

//import * as $ from 'jquery';

export default class TweetsFeedWebPart extends BaseClientSideWebPart<ITweetsFeedWebPartProps> {

  private twttr: any;

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {

    if (this.properties.account == null || this.properties.account == '') {
      var error = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectAccount}
            </div>
          </div>
        </div>
      `;
      this.domElement.innerHTML = error;
      return;
    }

    var dataChrome = '';
    if (this.properties.footer === false)
      dataChrome += "nofooter ";
    if (this.properties.header === false)
      dataChrome += "noheader ";
    if (this.properties.borders === false)
      dataChrome += "noborders ";
    if (this.properties.scrollbars === false)
      dataChrome += "noscrollbar ";
    if (this.properties.transparent === true)
      dataChrome += "transparent ";

    var limit = '';
    if (this.properties.autoLimit === false)
      limit = 'data-tweet-limit="' + this.properties.limit + '"';

    var html = '<a class="twitter-timeline" data-link-color="' + this.properties.linkColor + '" data-border-color="' + this.properties.borderColor + '" height="' + this.properties.height + '" width="' + this.properties.width + '" ' + limit + ' data-chrome="' + dataChrome + '" href="https://twitter.com/' + this.properties.account + '">Tweets by ' + this.properties.account + '</a>';
    this.domElement.innerHTML = html;

    if (this.twttr == null) {
      ModuleLoader.loadScript('//platform.twitter.com/widgets.js', 'twttr').then((twttr?: any)=> {
        this.twttr = twttr;
      });
    }
    else {
      this.twttr.widgets.load();
    }
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
                PropertyPaneTextField('account', {
                  label: strings.Account
                }),
                PropertyPaneToggle('autoLimit', {
                  label: strings.AutoLimit
                }),
                PropertyPaneSlider('limit', {
                  label: strings.Limit,
                  min: 1,
                  max: 1000,
                  step: 1
                }),
                PropertyPaneToggle('header', {
                  label: strings.Header
                }),
                PropertyPaneToggle('footer', {
                  label: strings.Footer
                }),
                PropertyPaneToggle('borders', {
                  label: strings.Borders
                }),
                PropertyPaneToggle('scrollbars', {
                  label: strings.Scrollbars
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField('width', {
                  label: strings.Width
                }),
                PropertyPaneTextField('height', {
                  label: strings.Height
                }),
                PropertyPaneToggle('transparent', {
                  label: strings.Transparent
                }),
                PropertyFieldColorPicker('linkColor', {
                  label: strings.LinkColor,
                  initialColor: this.properties.linkColor,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('borderColor', {
                  label: strings.BorderColor,
                  initialColor: this.properties.borderColor,
                  onPropertyChange: this.onPropertyChange
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
