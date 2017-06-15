/**
 * @file
 * News Carousel Web Part for SharePoint Framework SPFx
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

import * as strings from 'NewsCarouselStrings';
import { INewsCarouselWebPartProps } from './INewsCarouselWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

//Loads external JS libs
import * as $ from 'jquery';
require('unitegallery');
require('ug-theme-slider');

//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');

export default class NewsCarouselWebPart extends BaseClientSideWebPart<INewsCarouselWebPartProps> {

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

      //Render the item
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

    try {
      ($ as any)("#" + this.guid + "-gallery").unitegallery({
        gallery_theme: "slider",
        slider_enable_arrows: this.properties.enableArrows,
        slider_enable_bullets: this.properties.enableBullets,
        slider_transition: this.properties.transition,
        gallery_preserve_ratio: this.properties.preserveRatio,
        gallery_autoplay: this.properties.autoplay,
        gallery_play_interval: this.properties.speed,
        gallery_pause_on_mouseover: this.properties.pauseOnMouseover,
        gallery_carousel: this.properties.carousel,
        slider_enable_progress_indicator: this.properties.enableProgressIndicator,
        slider_enable_play_button: this.properties.enablePlayButton,
        slider_enable_fullscreen_button: this.properties.enableFullscreenButton,
        slider_enable_zoom_panel: this.properties.enableZoomPanel,
        slider_controls_always_on: this.properties.controlsAlwaysOn,
        slider_enable_text_panel: this.properties.textPanelEnable,
        slider_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
        slider_textpanel_bg_color: this.properties.textPanelBackgroundColor,
        slider_textpanel_bg_opacity: this.properties.textPanelOpacity,
        slider_textpanel_title_color: this.properties.textPanelFontColor,
        slider_textpanel_title_font_family: this.properties.textPanelFont,
        slider_textpanel_title_text_align: this.properties.textPanelAlign,
        slider_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : ''
      });
    }
    finally {

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
                  key: 'newsCarouselListField'
                })
              ]
            },
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneToggle('enableArrows', {
                  label: strings.EnableArrows
                }),
                PropertyPaneToggle('enableBullets', {
                  label: strings.EnableBullets
                }),
                PropertyPaneToggle('enableProgressIndicator', {
                  label: strings.EnableProgressIndicator
                }),
                PropertyPaneToggle('enablePlayButton', {
                  label: strings.EnablePlayButton
                }),
                PropertyPaneToggle('enableFullscreenButton', {
                  label: strings.EnableFullscreenButton
                }),
                PropertyPaneToggle('enableZoomPanel', {
                  label: strings.EnableZoomPanel
                }),
                PropertyPaneToggle('controlsAlwaysOn', {
                  label: strings.ControlsAlwaysOn
                })
              ]
            },
            {
              groupName: strings.EffectsGroupName,
              groupFields: [
                PropertyPaneDropdown('transition', {
                  label: strings.Transition,
                  options: [
                    {key: 'slide', text: 'Slide'},
                    {key: 'fade', text: 'Fade'}
                  ]
                }),
                PropertyPaneToggle('preserveRatio', {
                  label: strings.PreserveRatio
                }),
                PropertyPaneToggle('pauseOnMouseover', {
                  label: strings.PauseOnMouseover
                }),
                PropertyPaneToggle('carousel', {
                  label: strings.Carousel
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
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'newsCarouselAlignField'
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'newsCarouselFontField'
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
                  key: 'newsCarouselFontSizeField'
                }),
                PropertyFieldColorPickerMini('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'newsCarouselFontColorField'
                }),
                PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'newsCarouselBgColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
