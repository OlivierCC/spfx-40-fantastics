/**
 * @file
 * Tiles Gallery Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-client-preview';

import styles from './SimpleCarousel.module.scss';
import * as strings from 'simpleCarouselStrings';
import { ISimpleCarouselWebPartProps } from './ISimpleCarouselWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';
import { SPPicturesListService } from './SPPicturesListService';
import { ISPList, ISPListItem } from './ISPList';

import { PropertyFieldSPListQuery, PropertyFieldSPListQueryOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListQuery';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

require('jquery');

import * as $ from 'jquery';

export default class SimpleCarouselWebPart extends BaseClientSideWebPart<ISimpleCarouselWebPartProps> {

  private guid: string;

  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    this.onPropertyChange = this.onPropertyChange.bind(this);

    ModuleLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/css/unite-gallery.css');
    ModuleLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/themes/default/ug-theme-default.css');
  }

  public render(): void {

    if (this.properties.query == null || this.properties.query == '') {
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

    if (this.renderedOnce === false) {
      ModuleLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/js/unitegallery.min.js', 'jQuery').then((): void => {
        ModuleLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/themes/carousel/ug-theme-carousel.js', 'jQuery').then((): void => {
          this.renderContents();
        });
      });
    }

    const picturesListService: SPPicturesListService = new SPPicturesListService(this.properties, this.context);
      //Load the list of pictures from the current lib
      var queryUrl = this.properties.query;
      queryUrl += "$expand=File&$select=Title,Description,id,File,FileSystemObjectType";

      picturesListService.getPictures(queryUrl)
        .then((response) => {
          var responseVal = response.value;

          var outputHtml: string = '';
          outputHtml += `
              <div id="${this.guid}-gallery" style="display:none;">
          `;

          responseVal.map((object:ISPListItem, i:number) => {
            //Select the best Alt text with title, description or file's name
            var altText: string = object.Title;
            if (altText == null || altText == '')
              altText = object.Description;
            if (altText == null || altText == '')
            altText = object.File.Name;
            //Render the item
            outputHtml += `
                <img alt="${altText}" src="${object.File.ServerRelativeUrl}"
                  data-image="${object.File.ServerRelativeUrl}"
                  data-description="${altText}">
            `;
          });
          outputHtml += '</div>';
          this.domElement.innerHTML = outputHtml;
          this.renderContents();
      });

  }

  private renderContents(): void {

      ($ as any)("#" + this.guid + "-gallery").unitegallery({
        gallery_theme: "carousel",
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

   private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

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
                PropertyFieldSPListQuery('query', {
                  label: '',
                  query: this.properties.query,
                  includeHidden: false,
                  baseTemplate: 109,
                  orderBy: PropertyFieldSPListQueryOrderBy.Title,
                  showOrderBy: true,
                  showMax: true,
                  showFilters: true,
                  max: 100,
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
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
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontPicker('textPanelFont', {
                  label: strings.TextPanelFontFieldLabel,
                  initialValue: this.properties.textPanelFont,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('textPanelFontSize', {
                  label: strings.TextPanelFontSizeFieldLabel,
                  initialValue: this.properties.textPanelFontSize,
                  usePixels: true,
                  preview: true,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('textPanelFontColor', {
                  label: strings.TextPanelFontColorFieldLabel,
                  initialColor: this.properties.textPanelFontColor,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('textPanelBackgroundColor', {
                  label: strings.TextPanelBackgroundColorFieldLabel,
                  initialColor: this.properties.textPanelBackgroundColor,
                  onPropertyChange: this.onPropertyChange
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
