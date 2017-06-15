/**
 * @file
 * Image Color Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'ImageColorStrings';
import { IImageColorWebPartProps } from './IImageColorWebPartProps';

//Imports property pane custom fields
import { PropertyFieldPicturePicker } from 'sp-client-custom-fields/lib/PropertyFieldPicturePicker';

export default class ImageColorWebPart extends BaseClientSideWebPart<IImageColorWebPartProps> {

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

    if (this.properties.image == null || this.properties.image == '') {
      var error = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectImage}
            </div>
          </div>
        </div>
      `;
      this.domElement.innerHTML = error;
      return;
    }

    var html = '';
    html += `
    <style>
[class^="blend"] img {
  mix-blend-mode: luminosity;
}
[class^="blend"]:before {
  position: absolute;
  z-index: 3;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 0.2em;
  font-size: 14px;
}
[class^="blend"]:after {
  display: block;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  -webkit-filter: contrast(1.3);
  filter: contrast(1.3);
  mix-blend-mode: hue;
}
[class^="blend"][class*="-dark"] img {
  mix-blend-mode: darken;
}
[class^="blend"][class*="-dark"]:after {
  mix-blend-mode: lighten !important;
}
[class^="blend"][class*="-light"] img {
  mix-blend-mode: lighten;
}
[class^="blend"][class*="-light"]:after {
  mix-blend-mode: darken !important;
}
[class^="blend"][class*="-red"] {
  background: #E50914;
}
[class^="blend"][class*="-red"]:after {
  mix-blend-mode: hard-light;
  -webkit-filter: contrast(0.6) saturate(120%) brightness(1.2);
  filter: contrast(0.6) saturate(120%) brightness(1.2);
}
[class^="blend"][class*="-red"][class*="-dark"]:after {
  mix-blend-mode: lighten !important;
  -webkit-filter: contrast(1.1) !important;
  filter: contrast(1.1) !important;
}
[class^="blend"][class*="-red"][class*="-light"]:after {
  mix-blend-mode: color-dodge !important;
  -webkit-filter: saturate(400%) contrast(1.5);
  filter: saturate(400%) contrast(1.5);
}
[class^="blend"][class*="-red"]:after {
  background: #E50914;
}
[class^="blend"][class*="-red"]:after {
  background: #282581;
}
[class^="blend"][class*="-orange"] {
  background: #FCA300;
}
[class^="blend"][class*="-orange"][class*="-dark"]:after {
  mix-blend-mode: darken !important;
}
[class^="blend"][class*="-orange"][class*="-light"]:after {
  mix-blend-mode: hue !important;
  -webkit-filter: saturate(400%) contrast(1.5);
  filter: saturate(400%) contrast(1.5);
}
[class^="blend"][class*="-orange"]:after {
  background: #FCA300;
}
[class^="blend"][class*="-blue"] {
  background: #0066BF;
}
[class^="blend"][class*="-blue"]:not([class*="-dark"]):not([class*="-light"]):after {
  mix-blend-mode: hard-light;
  -webkit-filter: brightness(0.6);
  filter: brightness(0.6);
}
[class^="blend"][class*="-blue"][class*="-dark"]:after {
  mix-blend-mode: darken !important;
}
[class^="blend"][class*="-blue"]:after {
  background: #0066BF;
}
[class^="blend"][class*="-blue"]:after {
  background: #93EF90;
}
[class^="blend"][class*="-yellow"] {
  background: #FEDD31;
}
[class^="blend"][class*="-yellow"]:not([class*="-dark"]):not([class*="-light"]):after {
  -webkit-filter: brightness(3.5);
  filter: brightness(3.5);
  mix-blend-mode: soft-light;
}
[class^="blend"][class*="-yellow"][class*="-dark"]:after {
  mix-blend-mode: color-dodge !important;
  -webkit-filter: hue-rotate(70deg);
  filter: hue-rotate(70deg);
}
[class^="blend"][class*="-yellow"][class*="-light"] {
  background: #000000;
}
[class^="blend"][class*="-yellow"][class*="-light"]:after {
  mix-blend-mode: color !important;
  -webkit-filter: brightness(3) hue-rotate(93deg) contrast(2) saturate(150);
  filter: brightness(3) hue-rotate(93deg) contrast(2) saturate(150);
}
[class^="blend"][class*="-yellow"]:after {
  background: #FEDD31;
}
[class^="blend"][class*="-yellow"]:after {
  background: #EF3CB4;
}
[class^="blend"][class*="-purple"] {
  background: #BC6D14;
}
[class^="blend"][class*="-purple"]:not([class*="-dark"]):not([class*="-light"]) {
  background: rebeccapurple;
}
[class^="blend"][class*="-purple"]:not([class*="-dark"]):not([class*="-light"]):after {
  mix-blend-mode: darken !important;
}
[class^="blend"][class*="-purple"][class*="-dark"] {
  background: #B10AFF;
}
[class^="blend"][class*="-purple"][class*="-dark"]:after {
  mix-blend-mode: soft-light !important;
  -webkit-filter: saturate(100);
  filter: saturate(100);
}
[class^="blend"][class*="-purple"][class*="-light"]:after {
  background: #A37FC7;
  -webkit-filter: saturate(520%) brightness(10.5) contrast(350) !important;
  filter: saturate(520%) brightness(10.5) contrast(350) !important;
}
[class^="blend"][class*="-purple"]:after {
  background: #BC6D14;
}
[class^="blend"][class*="-purple"]:after {
  background: #ACFCEE;
}
[class^="blend"][class*="-green"] {
  background: #11C966;
}
[class^="blend"][class*="-green"]:not([class*="-dark"]):not([class*="-light"]):after {
  mix-blend-mode: soft-light;
}
[class^="blend"][class*="-green"][class*="-light"]:after {
  mix-blend-mode: color-dodge !important;
  -webkit-filter: saturate(100%) brightness(0.8) contrast(160%);
  filter: saturate(100%) brightness(0.8) contrast(160%);
}
[class^="blend"][class*="-green"]:after {
  background: #11C966;
}
[class^="blend"][class*="-green"]:after {
  background: #2D3181;
}
[class^="blend"][class*="-pink"] {
  background: #EA4C89;
}
[class^="blend"][class*="-pink"][class*="-dark"]:after {
  background: #1D0E14;
}
[class^="blend"][class*="-pink"][class*="-light"]:after {
  background: #FF468D;
  mix-blend-mode: lighten !important;
  -webkit-filter: contrast(1) saturate(250%) !important;
  filter: contrast(1) saturate(250%) !important;
}
[class^="blend"][class*="-pink"]:after {
  background: #EA4C89;
}
[class^="blend"][class*="-pink"]:after {
  background: #EA4C89;
}
[class^="blend"][class*="-blue-yellow"]:not([class*="-dark"]):not([class*="-light"]) {
  background: linear-gradient(to top left, #55ACEE, #FEDD31);
}
[class^="blend"][class*="-blue-yellow"][class*="-dark"]:after {
  mix-blend-mode: hard-light !important;
}
[class^="blend"][class*="-blue-yellow"][class*="-light"]:after {
  mix-blend-mode: hard-light !important;
  -webkit-filter: none;
  filter: none;
}
[class^="blend"][class*="-blue-yellow"]:after {
  background: linear-gradient(to top left, #55ACEE, #FEDD31) !important;
}
[class^="blend"][class*="-pink-yellow"]:not([class*="-dark"]):not([class*="-light"]) {
  background: linear-gradient(to bottom right, #FAA6FB, #FBBC05) !important;
}
[class^="blend"][class*="-pink-yellow"][class*="-dark"]:after {
  mix-blend-mode: hue !important;
  -webkit-filter: none !important;
  filter: none !important;
}
[class^="blend"][class*="-pink-yellow"][class*="-light"]:after {
  mix-blend-mode: hard-light !important;
  -webkit-filter: none !important;
  filter: none !important;
}
[class^="blend"][class*="-pink-yellow"]:after {
  background: linear-gradient(to top left, #FAA6FB, #FBBC05) !important;
}
[class^="blend"][class*="-red-blue"]:not([class*="-dark"]):not([class*="-light"]) {
  background: linear-gradient(to bottom right, #3993E2, #E2544B);
}
[class^="blend"][class*="-red-blue"]:not([class*="-dark"]):not([class*="-light"]):after {
  -webkit-filter: none;
  filter: none;
  mix-blend-mode: hard-light;
}
[class^="blend"][class*="-red-blue"][class*="-dark"]:after {
  mix-blend-mode: hard-light !important;
  -webkit-filter: none !important;
  filter: none !important;
}
[class^="blend"][class*="-red-blue"][class*="-light"]:after {
  mix-blend-mode: screen !important;
  -webkit-filter: saturate(300%) brightness(1.2) !important;
  filter: saturate(300%) brightness(1.2) !important;
}
[class^="blend"][class*="-red-blue"]:after {
  background: linear-gradient(to bottom right, #3993E2, #E2544B);
}
    </style>
    `;

    var fColor = this.properties.color;
    if (fColor == null)
      fColor = '';
    var fAlt = this.properties.alt;
    if (fAlt == null)
      fAlt = '';
    var fLinkText = this.properties.linkText;
    if (fLinkText == null)
      fLinkText = '';
    if (this.properties.linkUrl != null && this.properties.linkUrl != '')
      html += '<a href="' + this.properties.linkUrl + '" alt="' + fLinkText + '">';
    html += '<div><div class="' + fColor + '">';
    html += '<img src="' + this.properties.image + '" style="width: 100%" alt="' + fAlt + '" title="' + fAlt + '"/>';
    html += '</div></div>';
    if (this.properties.linkUrl != null && this.properties.linkUrl != '')
      html += '</a>';

    this.domElement.innerHTML = html;
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
                PropertyFieldPicturePicker('image', {
                  label: strings.Image,
                  initialValue: this.properties.image,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: "imageColorPictureField"
                }),
                PropertyPaneDropdown('color', {
                  label: strings.Color,
                  options: [
                    {key: 'blend-blue', text: 'blend-blue'},
                    {key: 'blend-blue-dark', text: 'blend-blue-dark'},
                    {key: 'blend-blue-light', text: 'blend-blue-light'},
                    {key: 'blend-orange', text: 'blend-orange'},
                    {key: 'blend-orange-dark', text: 'blend-orange-dark'},
                    {key: 'blend-orange-light', text: 'blend-orange-light'},
                    {key: 'blend-red', text: 'blend-red'},
                    {key: 'blend-red-dark', text: 'blend-red-dark'},
                    {key: 'blend-red-light', text: 'blend-red-light'},
                    {key: 'blend-green', text: 'blend-green'},
                    {key: 'blend-green-dark', text: 'blend-green-dark'},
                    {key: 'blend-green-light', text: 'blend-green-light'},
                    {key: 'blend-yellow', text: 'blend-yellow'},
                    {key: 'blend-yellow-dark', text: 'blend-yellow-dark'},
                    {key: 'blend-yellow-light', text: 'blend-yellow-light'},
                    {key: 'blend-purple', text: 'blend-purple'},
                    {key: 'blend-purple-dark', text: 'blend-purple-dark'},
                    {key: 'blend-purple-light', text: 'blend-purple-light'},
                    {key: 'blend-pink', text: 'blend-pink'},
                    {key: 'blend-pink-dark', text: 'blend-pink-dark'},
                    {key: 'blend-pink-light', text: 'blend-pink-light'},
                    {key: 'blend-blue-yellow', text: 'blend-blue-yellow'},
                    {key: 'blend-blue-yellow-dark', text: 'blend-blue-yellow-dark'},
                    {key: 'blend-blue-yellow-light', text: 'blend-blue-yellow-light'},
                    {key: 'blend-pink-yellow', text: 'blend-pink-yellow'},
                    {key: 'blend-pink-yellow-dark', text: 'blend-pink-yellow-dark'},
                    {key: 'blend-pink-yellow-light', text: 'blend-pink-yellow-light'},
                    {key: 'blend-red-blue', text: 'blend-red-blue-dark'},
                    {key: 'blend-red-blue-dark', text: 'blend-red-blue-dark'},
                    {key: 'blend-red-blue-light', text: 'blend-red-blue-light'}
                  ]
                }),
                PropertyPaneTextField('alt', {
                  label: strings.Alt
                }),
                PropertyPaneTextField('linkText', {
                  label: strings.LinkText
                }),
                PropertyPaneTextField('linkUrl', {
                  label: strings.LinkUrl
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
