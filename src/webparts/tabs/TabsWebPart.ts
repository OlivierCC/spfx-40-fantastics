/**
 * @file
 * Tabs Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

import * as strings from 'TabsStrings';
import { ITabsWebPartProps } from './ITabsWebPartProps';

//Imports property pane custom fields
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';

import * as $ from 'jquery';

export default class TabsWebPart extends BaseClientSideWebPart<ITabsWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();

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

    if (Environment.type === EnvironmentType.ClassicSharePoint) {
      var errorHtml = '';
      errorHtml += '<div style="color: red;">';
      errorHtml += '<div style="display:inline-block; vertical-align: middle;"><i class="ms-Icon ms-Icon--Error" style="font-size: 20px"></i></div>';
      errorHtml += '<div style="display:inline-block; vertical-align: middle;margin-left:7px;"><span>';
      errorHtml += strings.ErrorClassicSharePoint;
      errorHtml += '</span></div>';
      errorHtml += '</div>';
      this.domElement.innerHTML = errorHtml;
      return;
    }

    var html = '';
    html += `
<style>
/* --------------------------------

Main components

-------------------------------- */
.cd-tabs {
  position: relative;
  width: 100%;
  max-width: 960px;
}
.cd-tabs:after {
  content: "";
  display: table;
  clear: both;
}
.cd-tabs::after {
  /* subtle gradient layer on top right - to indicate it's possible to scroll */
  position: absolute;
  top: 0;
  right: 0;
  height: 60px;
  width: 50px;
  z-index: 1;
  pointer-events: none;
  background: -webkit-linear-gradient( right , ${this.properties.disableColor}, rgba(248, 247, 238, 0));
  background: linear-gradient(to left, ${this.properties.disableColor}, rgba(248, 247, 238, 0));
  visibility: visible;
  opacity: 1;
  -webkit-transition: opacity .3s 0s, visibility 0s 0s;
  -moz-transition: opacity .3s 0s, visibility 0s 0s;
  transition: opacity .3s 0s, visibility 0s 0s;
}
.no-cssgradients .cd-tabs::after {
  display: none;
}
.cd-tabs.is-ended::after {
  /* class added in jQuery - remove the gradient layer when it's no longer possible to scroll */
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity .3s 0s, visibility 0s .3s;
  -moz-transition: opacity .3s 0s, visibility 0s .3s;
  transition: opacity .3s 0s, visibility 0s .3s;
}
.cd-tabs nav {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: ${this.properties.disableColor};
  box-shadow: inset 0 -2px 3px rgba(203, 196, 130, 0.06);
}
@media only screen and (min-width: 768px) {
  .cd-tabs::after {
    display: none;
  }
  .cd-tabs nav {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    box-shadow: inset -2px 0 3px rgba(203, 196, 130, 0.06);
    z-index: 1;
  }
}
@media only screen and (min-width: 960px) {
  .cd-tabs nav {
    position: relative;
    float: none;
    background: transparent;
    box-shadow: none;
  }
}

.cd-tabs-navigation {
  width: 360px;
  padding: 0px;
  margin: 0px;
}
.cd-tabs-navigation:after {
  content: "";
  display: table;
  clear: both;
}
.cd-tabs-navigation li {
  float: left;
  list-style-type: none;
}
.cd-tabs-navigation span {
  position: relative;
  display: block;
  height: 60px;
  width: 60px;
  text-align: center;
  font-size: 12px;
  font-size: 0.75rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 700;
  color: #c3c2b9;
  padding-top: 34px;
  text-decoration: none;
  cursor: pointer;
}
.no-touch .cd-tabs-navigation span:hover {
  color: #29324e;
  background-color: rgba(233, 230, 202, 0.3);
}
.cd-tabs-navigation span.selected {
  background-color: #ffffff !important;
  box-shadow: inset 0 2px 0 ${this.properties.selectedColor};
  color: #29324e;
  cursor: auto;
}
.cd-tabs-navigation span::before {
  /* icons */
  position: absolute;
  top: 12px;
  left: 50%;
  margin-left: -10px;
  display: inline-block;
  height: 20px;
  width: 20px;
  /*background-image: url("../img/vicons.svg");
  background-repeat: no-repeat;*/
}
@media only screen and (min-width: 768px) {
  .cd-tabs-navigation {
    /* move the nav to the left on medium sized devices */
    width: 80px;
    float: left;
  }
  .cd-tabs-navigation span {
    height: 80px;
    width: 80px;
    padding-top: 46px;
  }
  .cd-tabs-navigation span.selected {
    box-shadow: inset 2px 0 0 ${this.properties.selectedColor};
  }
  .cd-tabs-navigation span::before {
    top: 22px;
  }
}
@media only screen and (min-width: 960px) {
  .cd-tabs-navigation {
    /* tabbed on top on big devices */
    width: auto;
    background-color: ${this.properties.disableColor};
    box-shadow: inset 0 -2px 3px rgba(203, 196, 130, 0.06);
  }
  .cd-tabs-navigation span {
    height: 60px;
    line-height: 60px;
    width: auto;
    text-align: left;
    font-size: 14px;
    font-size: 0.875rem;
    padding: 0 2.8em 0 4em;
  }
  .cd-tabs-navigation span.selected {
    box-shadow: inset 0 2px 0 ${this.properties.selectedColor};
  }
  .cd-tabs-navigation span::before {
    top: 50%;
    margin-top: -10px;
    margin-left: 0;
    left: 38px;
  }
}

.cd-tabs-content {
  padding: 0px;
}
.cd-tabs-content li {
  display: none;
}
.cd-tabs-content li.selected {
  display: block;
  -webkit-animation: cd-fade-in 0.5s;
  -moz-animation: cd-fade-in 0.5s;
  animation: cd-fade-in 0.5s;
}
@media only screen and (min-width: 768px) {
  .cd-tabs-content {
    min-height: 480px;
  }
  .cd-tabs-content li {
      padding-left: 90px;
  }
}
@media only screen and (min-width: 960px) {
  .cd-tabs-content {
    min-height: 0;
  }
  .cd-tabs-content li {
    padding-left: 0px;
  }
  .cd-tabs-content li p {
  }
}

@-webkit-keyframes cd-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes cd-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes cd-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
    `;

    html += '<div class="cd-tabs"><nav><ul class="cd-tabs-navigation">';

    this.properties.tabs.map((tab: any, index: number) => {
       html += '<li><span data-content="' + this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '">' + tab.Title + '</span></li>';
    });

    html += '</ul></nav><ul class="cd-tabs-content">';

    this.properties.tabs.map((tab: any, index: number) => {

              if (this.displayMode == DisplayMode.Edit) {
                html += '<li data-content="' + this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '">';
                html += '<div><textarea name="' + this.guid + '-editor-' + index + '" id="' + this.guid + '-editor-' + index + '">' + (tab.Content != null ? tab.Content : '') + '</textarea></div>';
                html += '</li>';
              }
              else {
                html += '<li data-content="' + this.guid + index + '" class="' + (index == 0 ? "selected" : '') + '"}>';
                html += tab.Content + '</li>';
              }
    });
    html += '</ul></div>';

    this.domElement.innerHTML = html;

    this.setClicked();

    if (this.displayMode == DisplayMode.Edit) {

        var ckEditorCdn = '//cdn.ckeditor.com/4.6.2/full/ckeditor.js';
        SPComponentLoader.loadScript(ckEditorCdn, { globalExportsName: 'CKEDITOR' }).then((CKEDITOR: any): void => {
          if (this.properties.inline == null || this.properties.inline === false) {
            for (var tab = 0; tab < this.properties.tabs.length; tab++) {
              CKEDITOR.replace( this.guid + '-editor-' + tab, {
                    skin: 'moono-lisa,//cdn.ckeditor.com/4.6.2/full-all/skins/moono-lisa/'
              }  );
            }

          }
          else {
            for (var tab2 = 0; tab2 < this.properties.tabs.length; tab2++) {
              CKEDITOR.inline( this.guid + '-editor-' + tab2, {
                    skin: 'moono-lisa,//cdn.ckeditor.com/4.4.3/full-all/skins/moono-lisa/'
              }   );
            }
          }

          for (var i in CKEDITOR.instances) {
            CKEDITOR.instances[i].on('change', (elm?, val?) =>
            {
              elm.sender.updateElement();
              var value = ((document.getElementById(elm.sender.name)) as any).value;
              var id = elm.sender.name.split("-editor-")[1];
              this.properties.tabs[id].Content = value;
            });
          }
        });

    }
  }

  private setClicked(): void {
      var tabs = $('.cd-tabs');

        tabs.each(function(){
          var tab = $(this),
            tabItems = tab.find('ul.cd-tabs-navigation'),
            tabContentWrapper = tab.children('ul.cd-tabs-content'),
            tabNavigation = tab.find('nav');

          tabItems.on('click', 'span', function(event){
            event.preventDefault();
            var selectedItem = $(this);
            if( !selectedItem.hasClass('selected') ) {
              var selectedTab = selectedItem.data('content'),
                selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
                slectedContentHeight = selectedContent.innerHeight();

              tabItems.find('span.selected').removeClass('selected');
              selectedItem.addClass('selected');
              selectedContent.addClass('selected').siblings('li').removeClass('selected');
              //animate tabContentWrapper height when content changes
              tabContentWrapper.animate({
                'height': slectedContentHeight
              }, 200);
            }
            return false;
          });

          //hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
          checkScrolling(tabNavigation);
          tabNavigation.on('scroll', function(){
            checkScrolling($(this));
          });
        });

        $(window).on('resize', () =>{
          tabs.each(function(){
            var tab = $(this);
            checkScrolling(tab.find('nav'));
            tab.find('.cd-tabs-content').css('height', 'auto');
          });
        });

        function checkScrolling(tabs2){
          var totalTabWidth = parseInt(tabs2.children('.cd-tabs-navigation').width()),
            tabsViewport = parseInt(tabs2.width());
          if( tabs2.scrollLeft() >= totalTabWidth - tabsViewport) {
            tabs2.parent('.cd-tabs').addClass('is-ended');
          } else {
            tabs2.parent('.cd-tabs').removeClass('is-ended');
          }
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
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCustomList('tabs', {
                  label: strings.Tabs,
                  value: this.properties.tabs,
                  headerText: strings.ManageTabs,
                  fields: [
                    { id: 'Title', title: 'Title', required: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'tabsListField'
                })
              ]
            },
            {
              groupName: strings.TextEditorGroupName,
              groupFields: [
                PropertyPaneToggle('inline', {
                  label: strings.Inline,
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyFieldColorPickerMini('disableColor', {
                  label: strings.DisableColor,
                  initialColor: this.properties.disableColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tabsDisableColorField'
                }),
                PropertyFieldColorPickerMini('selectedColor', {
                  label: strings.SelectedColor,
                  initialColor: this.properties.selectedColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'tabsSelectedColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
