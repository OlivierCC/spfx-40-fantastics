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
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneSlider
} from '@microsoft/sp-client-preview';

import * as strings from 'gridGalleryStrings';
import { IGridGalleryWebPartProps } from './IGridGalleryWebPartProps';
import ModuleLoader from '@microsoft/sp-module-loader';
import { SPPicturesListService } from './SPPicturesListService';
import { ISPListItem } from './ISPList';

import { PropertyFieldSPListQuery, PropertyFieldSPListQueryOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListQuery';
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldAlignPicker } from 'sp-client-custom-fields/lib/PropertyFieldAlignPicker';

require('jquery');

import * as $ from 'jquery';

export default class GridGalleryWebPart extends BaseClientSideWebPart<IGridGalleryWebPartProps> {

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
        ModuleLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/unitegallery/1.7.28/themes/grid/ug-theme-grid.js', 'jQuery').then((): void => {
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
        gallery_theme: "grid",
        slider_enable_arrows: this.properties.enableArrows,
        slider_enable_bullets: this.properties.enableBullets,
        slider_enable_progress_indicator: this.properties.enableProgressIndicator,
        slider_enable_play_button: this.properties.enablePlayButton,
        slider_enable_fullscreen_button: this.properties.enableFullscreenButton,
        slider_enable_zoom_panel: this.properties.enableZoomPanel,
        slider_controls_always_on: this.properties.controlsAlwaysOn,
        theme_panel_position: this.properties.position,
        gallery_autoplay: this.properties.autoplay,
        thumb_border_effect: this.properties.enableBorder,
        thumb_border_width: this.properties.border,
        thumb_border_color: this.properties.borderColor,
        slider_enable_text_panel: this.properties.textPanelEnable,
        slider_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
        slider_textpanel_bg_color: this.properties.textPanelBackgroundColor,
        slider_textpanel_bg_opacity: this.properties.textPanelOpacity,
        slider_textpanel_title_color: this.properties.textPanelFontColor,
        slider_textpanel_title_font_family: this.properties.textPanelFont,
        slider_textpanel_title_text_align: this.properties.textPanelAlign,
        gallery_play_interval: this.properties.speed,
        gallery_pause_on_mouseover: this.properties.pauseOnMouseover,
        tile_enable_icons: this.properties.enableIcons,
        thumb_width: this.properties.tileWidth,
        thumb_height: this.properties.tileHeight,
        grid_num_cols: this.properties.numCols,
        slider_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : ''
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
                PropertyPaneDropdown('position', {
                  label: strings.Position,
                  options: [
                    {key: 'top', text: 'top'},
                    {key: 'bottom', text: 'bottom'},
                    {key: 'left', text: 'left'},
                    {key: 'right', text: 'right'}
                  ]
                }),
                PropertyPaneSlider('numCols', {
                  label: strings.NumCols,
                  min: 1,
                  max: 6,
                  step: 1
                }),
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
