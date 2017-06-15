/**
 * @file
 * Tweets Feed Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'TweetsFeedStrings';
import { ITweetsFeedWebPartProps } from './ITweetsFeedWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';

var twttr: any = require('twitter');

export default class TweetsFeedWebPart extends BaseClientSideWebPart<ITweetsFeedWebPartProps> {

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

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

    twttr.widgets.load();
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
                PropertyFieldColorPickerMini('linkColor', {
                  label: strings.LinkColor,
                  initialColor: this.properties.linkColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tweetsFeedLinkColorField'
                }),
                PropertyFieldColorPickerMini('borderColor', {
                  label: strings.BorderColor,
                  initialColor: this.properties.borderColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tweetsFeedBorderColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
