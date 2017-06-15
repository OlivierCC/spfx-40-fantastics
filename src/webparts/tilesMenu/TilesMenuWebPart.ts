/**
 * @file
 * Tiles Menu Web Part for SharePoint Framework SPFx
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
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'TilesMenuStrings';
import { ITilesMenuWebPartProps } from './ITilesMenuWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';

//Loads external JS libs
require('jquery');
import * as $ from 'jquery';
require('unitegallery');
require('ug-theme-tiles');

//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');

export default class TilesMenuWebPart extends BaseClientSideWebPart<ITilesMenuWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();

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

    if (this.properties.items == null || this.properties.items.length == 0) {
      //Display select a list message
      this.domElement.innerHTML = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectList}
            </div>
          </div>
        </div>
      `;
      return;
    }

    var outputHtml: string = '';
    outputHtml += `
      <div id="${this.guid}-gallery" style="display:none;">
    `;

    for (var i = 0; i < this.properties.items.length; i++) {
      var newsItem: any = this.properties.items[i];
      var newsTitle: string = newsItem['Title'];
      var newsDesc: string = newsItem['Description'];
      var newsEnable: string = newsItem['Enable'];
      var newsPicUrl: string = newsItem['Picture'];
      var newsLink: string = newsItem['Link Url'];

      if (newsEnable == "false")
        continue;

     outputHtml += `
         <a href="${newsLink}"><img alt="${newsTitle}" src="${newsPicUrl}"
          data-image="${newsPicUrl}"
          data-description="${newsDesc}"></a>
        `;
    }
    outputHtml += '</div>';
    this.domElement.innerHTML = outputHtml;

    this.renderContents();
  }

  private renderContents(): void {

      ($ as any)("#" + this.guid + "-gallery").unitegallery({
        tile_as_link: true,
        tiles_type: this.properties.justified === true ? "justified": '',
        tile_enable_icons: this.properties.enableIcons,
        tile_enable_textpanel: this.properties.textPanelEnable,
        tile_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
        tile_textpanel_position: this.properties.textPanelPosition,
        tile_textpanel_bg_opacity: this.properties.textPanelOpacity,
        tile_textpanel_bg_color: this.properties.textPanelBackgroundColor,
        tile_textpanel_title_font_family: this.properties.textPanelFont,
        tile_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : '',
        tile_textpanel_title_text_align: this.properties.textPanelAlign,
        tile_textpanel_title_color: this.properties.textPanelFontColor,
        tiles_space_between_cols: this.properties.spaceBetweenCols,
        tile_enable_border: this.properties.enableBorder,
        tile_border_width: this.properties.border,
        tile_border_color: this.properties.borderColor,
        tile_enable_shadow: this.properties.enableShadow
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPageGeneral
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCustomList('items', {
                  label: strings.Items,
                  value: this.properties.items,
                  headerText: strings.ManageItems,
                  fields: [
                    { id: 'Title', title: 'Title', required: true, type: CustomListFieldType.string },
                    { id: 'Enable', title: 'Enable', required: true, type: CustomListFieldType.boolean },
                    { id: 'Description', title: 'Description', required: false, hidden: true, type: CustomListFieldType.string },
                    { id: 'Picture', title: 'Picture', required: true, hidden: true, type: CustomListFieldType.picture },
                    { id: 'Link Url', title: 'Link Url', required: true, hidden: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'tilesMenuListField'
                })
              ]
            },
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle('justified', {
                  label: strings.TilesTypeFieldLabel
                }),
                PropertyPaneToggle('enableIcons', {
                  label: strings.EnableIconsFieldLabel
                }),
                PropertyPaneToggle('enableShadow', {
                  label: strings.EnableShadowFieldLabel
                }),
                PropertyPaneSlider('spaceBetweenCols', {
                  label: strings.SpaceBetweenColsFieldLabel,
                  min: 0,
                  max: 100,
                  step: 1
                }),
              ]
            }
          ]
        },
        {
            header: {
              description: strings.PropertyPageTextPanel
            },
            groups: [
            {
              groupName: strings.TextPanelGroupName,
              groupFields: [
                PropertyPaneToggle('textPanelEnable', {
                  label: strings.TextPanelEnableFieldLabel
                }),
                PropertyPaneToggle('textPanelAlwaysOnTop', {
                  label: strings.TextPanelAlwaysOnTopFieldLabel
                }),
                PropertyPaneSlider('textPanelOpacity', {
                  label: strings.TextPanelOpacityFieldLabel,
                  min: 0,
                  max: 1,
                  step: 0.1
                }),
                PropertyPaneDropdown('textPanelPosition', {
                  label: strings.TextPanelPositionFieldLabel,
                  options: [
                    {key: 'inside_bottom', text: "Inside bottom"},
                    {key: 'inside_top', text: "Inside top"},
                    {key: 'inside_center', text: "Inside center"},
                    {key: 'top', text: "Top"},
                    {key: 'bottom', text: "Bottom"}
                  ]
                }),
                PropertyFieldAlignPicker('textPanelAlign', {
                  label: strings.TextPanelAlignFieldLabel,
                  initialValue: this.properties.textPanelAlign,
                  onPropertyChanged: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuAlignField'
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuFontField'
                }),
                PropertyFieldFontSizePicker('textPanelFontSize', {
                  label: strings.TextPanelFontSizeFieldLabel,
                  initialValue: this.properties.textPanelFontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuFontSizeField'
                }),
                PropertyFieldColorPickerMini('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuFontColorField'
                }),
                PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuBgColorField'
                })
              ]
            }
          ]
        },
        {
            header: {
              description: strings.PropertyPageBorder
            },
            groups: [
            {
              groupName: strings.BorderGroupName,
              groupFields: [
                PropertyPaneToggle('enableBorder', {
                  label: strings.EnableBorderFieldLabel
                }),
                PropertyPaneSlider('border', {
                  label: strings.BorderFieldLabel,
                  min: 0,
                  max: 50,
                  step: 1
                }),
                PropertyFieldColorPickerMini('borderColor', {
                  label: strings.BorderColorFieldLabel,
                  initialColor: this.properties.borderColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tilesMenuBorderColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
