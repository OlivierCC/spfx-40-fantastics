/**
 * @file
 * News Slider Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewsSliderStrings';
import { INewsSliderWebPartProps } from './INewsSliderWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

require('jquery');

import * as $ from 'jquery';

export default class NewsSliderWebPart extends BaseClientSideWebPart<INewsSliderWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);

    ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/css/unite-gallery.css');
    ModuleLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/themes/default/ug-theme-default.css');
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

      //Render the item
      outputHtml += `
        <a href="${newsLink}"><img alt="${newsTitle}" src="${newsPicUrl}"
         data-image="${newsPicUrl}"
         data-description="${newsDesc}"></a>
      `;
    }

    outputHtml += '</div>';
    this.domElement.innerHTML = outputHtml;

    ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/js/unitegallery.min.js', 'jQuery').then((): void => {
        ModuleLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/themes/carousel/ug-theme-carousel.js', 'jQuery').then((): void => {
          this.renderContents();
        });
    });
  }

  private renderContents(): void {

      ($ as any)("#" + this.guid + "-gallery").unitegallery({
        gallery_theme: "carousel",
        tile_as_link: true,
        theme_enable_navigation: this.properties.enableArrows,
        carousel_autoplay: this.properties.autoplay,
        tile_enable_border: this.properties.enableBorder,
        tile_border_width: this.properties.border,
        tile_border_color: this.properties.borderColor,
        tile_enable_textpanel: this.properties.textPanelEnable,
        tile_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
        tile_textpanel_bg_color: this.properties.textPanelBackgroundColor,
        tile_textpanel_bg_opacity: this.properties.textPanelOpacity,
        tile_textpanel_title_color: this.properties.textPanelFontColor,
        tile_textpanel_title_font_family: this.properties.textPanelFont,
        tile_textpanel_title_text_align: this.properties.textPanelAlign,
        carousel_autoplay_timeout: this.properties.speed,
        carousel_autoplay_pause_onhover: this.properties.pauseOnMouseover,
        tile_enable_icons: this.properties.enableIcons,
        tile_width: this.properties.tileWidth,
        tile_height: this.properties.tileHeight,
        tile_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : ''
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
                    { title: 'Title', required: true, type: CustomListFieldType.string },
                    { title: 'Enable', required: true, type: CustomListFieldType.boolean },
                    /*{ title: 'Start Date', required: false, type: CustomListFieldType.date },
                    { title: 'End Date', required: false, type: CustomListFieldType.date },
                    */
                    { title: 'Description', required: false, hidden: true, type: CustomListFieldType.string },
                    { title: 'Picture', required: true, hidden: true, type: CustomListFieldType.string },
                    { title: 'Link Url', required: true, hidden: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context,
                  properties: this.properties
                })
              ]
            },
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle('enableArrows', {
                  label: strings.EnableArrows
                }),
                PropertyPaneToggle('enableIcons', {
                  label: strings.EnableIconsFieldLabel
                }),
                PropertyPaneSlider('tileWidth', {
                  label: strings.TileWidth,
                  min: 1,
                  max: 500,
                  step: 1
                }),
                PropertyPaneSlider('tileHeight', {
                  label: strings.TileHeight,
                  min: 1,
                  max: 500,
                  step: 1
                })
              ]
            },
            {
              groupName: strings.EffectsGroupName,
              groupFields: [
                PropertyPaneToggle('pauseOnMouseover', {
                  label: strings.PauseOnMouseover
                }),
                PropertyPaneToggle('autoplay', {
                  label: strings.Autoplay
                }),
                PropertyPaneSlider('speed', {
                  label: strings.Speed,
                  min: 0,
                  max: 7000,
                  step: 100
                })
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
                PropertyFieldAlignPicker('textPanelAlign', {
                  label: strings.TextPanelAlignFieldLabel,
                  initialValue: this.properties.textPanelAlign,
                  onPropertyChanged: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('textPanelFontSize', {
                  label: strings.TextPanelFontSizeFieldLabel,
                  initialValue: this.properties.textPanelFontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
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
                PropertyFieldColorPicker('borderColor', {
                  label: strings.BorderColorFieldLabel,
                  initialColor: this.properties.borderColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
