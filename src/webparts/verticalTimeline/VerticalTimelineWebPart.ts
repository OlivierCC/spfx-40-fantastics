/**
 * @file
 * Vertical Timeline Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'VerticalTimelineStrings';
import { IVerticalTimelineWebPartProps } from './IVerticalTimelineWebPartProps';
import { SPCalendarService } from './SPCalendarService';
import { ISPListItem } from './ISPList';

//Imports property pane custom fields
import { PropertyFieldSPListQuery, PropertyFieldSPListQueryOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListQuery';
import { PropertyFieldIconPicker } from 'sp-client-custom-fields/lib/PropertyFieldIconPicker';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';

import * as $ from 'jquery';

export default class VerticalTimelineWebPart extends BaseClientSideWebPart<IVerticalTimelineWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();
    this.timelineAnimate = this.timelineAnimate.bind(this);

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

    var html = '';

    html += `
<style>
.bg-primary, .bg-success, .bg-info, .bg-warning, .bg-danger, .bg-muted {
  color: white; height: 40px;
  }
  .bg-primary .page-header, .bg-success .page-header, .bg-info .page-header, .bg-warning .page-header, .bg-danger .page-header, .bg-muted .page-header {
    color: white; }

.bg-primary {
  background-color: #32b9b1; }

.bg-success {
  background-color: #51be38; }

.bg-info {
  background-color: #5bc0de; }

.bg-warning {
  background-color: #ef9544; }

.bg-danger {
  background-color: #f05a5b; }

.bg-muted {
  background-color: #bbbbbb; }

.panel {
  border: 0; }
  .panel .panel-body {
    padding: 20px; }
  .panel-body {
    background-color: ${this.properties.backgroundColor};
    color: ${this.properties.color}
  }

.panel-heading .panel-toggle {
  background: #f9fafa; }
.panel-heading .panel-title {
  font-size: 18px; }

.timeline {
  list-style: none;
  position: relative;
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
  overflow: hidden; }
  .timeline:after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -2px;
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    width: 4px;
    border-radius: 2px;
    display: block; }
  .timeline .timeline-row {
    padding-left: 50%;
    position: relative;
    z-index: 10; }
    .timeline .timeline-row .timeline-time {
      position: absolute;
      right: 50%;
      top: 31px;
      text-align: right;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1.3;
      font-weight: 600; }
      .timeline .timeline-row .timeline-time small {
        display: block;
        color: #999999;
        text-transform: uppercase;
        opacity: 0.75;
        font-size: 11px;
        font-weight: 400; }
    .timeline .timeline-row .timeline-icon {
      position: absolute;
      top: 30px;
      left: 50%;
      margin-left: -20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #eeeeee;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      padding: 3px;
      color: white;
      font-size: 14px;
      z-index: 100; }
      .timeline .timeline-row .timeline-icon > div {
        border-radius: 50%;
        line-height: 34px;
        font-size: 16px; }
    .timeline .timeline-row .timeline-content {
      margin-left: 40px;
      position: relative;
      background-color: white;
      color: #333333; }
      .timeline .timeline-row .timeline-content:after {
        content: "";
        position: absolute;
        top: 48px;
        left: -41px;
        height: 4px;
        width: 40px;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: -1; }
      .timeline .timeline-row .timeline-content .panel-body {
        padding: 15px 15px 2px;
        position: relative;
        z-index: 10; }
      .timeline .timeline-row .timeline-content h2 {
        font-size: 22px;
        margin-bottom: 12px;
        margin-top: 0;
        line-height: 1.2; }
      .timeline .timeline-row .timeline-content p {
        margin-bottom: 15px; }
      .timeline .timeline-row .timeline-content img {
        margin-bottom: 15px; }
      .timeline .timeline-row .timeline-content blockquote {
        border-color: #eeeeee; }
        .timeline .timeline-row .timeline-content blockquote footer, .timeline .timeline-row .timeline-content blockquote small, .timeline .timeline-row .timeline-content blockquote .small, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse footer, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse small, .timeline .timeline-row .timeline-content blockquote.blockquote-reverse .small {
          color: #999999; }
      .timeline .timeline-row .timeline-content .video-container {
        position: relative;
        padding-bottom: 56.25%;
        padding-top: 30px;
        height: 0;
        margin-bottom: 15px;
        overflow: hidden; }
        .timeline .timeline-row .timeline-content .video-container iframe, .timeline .timeline-row .timeline-content .video-container object, .timeline .timeline-row .timeline-content .video-container embed {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%; }
    .timeline .timeline-row:nth-child(odd) {
      padding-left: 0;
      padding-right: 50%; }
      .timeline .timeline-row:nth-child(odd) .timeline-time {
        right: auto;
        left: 50%;
        text-align: left;
        margin-right: 0;
        margin-left: 40px; }
      .timeline .timeline-row:nth-child(odd) .timeline-content {
        margin-right: 40px;
        margin-left: 0; }
        .timeline .timeline-row:nth-child(odd) .timeline-content:after {
          left: auto;
          right: -41px; }
  .timeline.animated .timeline-row .timeline-content {
    opacity: 0;
    left: 20px;
    -webkit-transition: all 0.8s;
    -moz-transition: all 0.8s;
    transition: all 0.8s; }
  .timeline.animated .timeline-row:nth-child(odd) .timeline-content {
    left: -20px; }
  .timeline.animated .timeline-row.active .timeline-content {
    opacity: 1;
    left: 0; }
  .timeline.animated .timeline-row.active:nth-child(odd) .timeline-content {
    left: 0; }

@media (max-width: 1200px) {
  .timeline {
    padding: 15px 10px; }
    .timeline:after {
      left: 28px; }
    .timeline .timeline-row {
      padding-left: 0;
      margin-bottom: 16px; }
      .timeline .timeline-row .timeline-time {
        position: relative;
        right: auto;
        top: 0;
        text-align: left;
        margin: 0 0 6px 56px; }
        .timeline .timeline-row .timeline-time strong {
          display: inline-block;
          margin-right: 10px; }
      .timeline .timeline-row .timeline-icon {
        top: 52px;
        left: -2px;
        margin-left: 0; }
      .timeline .timeline-row .timeline-content {
        margin-left: 56px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        position: relative; }
        .timeline .timeline-row .timeline-content:after {
          right: auto !important;
          left: -20px !important;
          top: 32px; }
      .timeline .timeline-row:nth-child(odd) {
        padding-right: 0; }
        .timeline .timeline-row:nth-child(odd) .timeline-time {
          position: relative;
          right: auto;
          left: auto;
          top: 0;
          text-align: left;
          margin: 0 0 6px 56px; }
        .timeline .timeline-row:nth-child(odd) .timeline-content {
          margin-right: 0;
          margin-left: 55px; }
    .timeline.animated .timeline-row:nth-child(odd) .timeline-content {
      left: 20px; }
    .timeline.animated .timeline-row.active:nth-child(odd) .timeline-content {
      left: 0; } }

</style>
    `;
      this.domElement.innerHTML = html;

      const picturesListService: SPCalendarService = new SPCalendarService(this.properties, this.context);
      //Load the list of pictures from the current lib
      var queryUrl = this.properties.query;

      picturesListService.getItems(queryUrl).then((response) => {

          var responseVal = response.value;

          if (responseVal == null || responseVal.length == 0) {
            this.domElement.innerHTML = `
              <div class="ms-MessageBar ms-MessageBar--error">
                <div class="ms-MessageBar-content">
                  <div class="ms-MessageBar-icon">
                    <i class="ms-Icon ms-Icon--ErrorBadge"></i>
                  </div>
                  <div class="ms-MessageBar-text">
                    ${strings.ErrorNoItems}
                  </div>
                </div>
              </div>
            `;
            return;
          }

          var outputHtml: string = '';
          outputHtml += `
              <div class="timeline animated">
          `;

          responseVal.map((object:ISPListItem, i:number) => {
            //Render the item
            var eventDate = object.EventDate;
            var dateEvent = new Date(eventDate);
            outputHtml += `
                 <div class="timeline-row">
                  <div class="timeline-time">
                    <small>${dateEvent.toDateString()}</small>${dateEvent.toLocaleTimeString()}
                  </div>
                  <div class="timeline-icon">
                    <div class="bg-primary">
                      <i style="font-size: 20px;padding-top: 2px;" class="ms-Icon ${this.properties.icon}" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="panel timeline-content">
                    <div class="panel-body">
                      <h2>
                        ${object.Title}
                      </h2>
                      <p>
                        ${object.Description}
                      </p>
                    </div>
                  </div>
                </div>
            `;
          });
          outputHtml += '</div>';
          this.domElement.innerHTML += outputHtml;
          this.timelineAnimate();
      });

    $('#pageContent').scroll(() => {
      this.timelineAnimate();
    });

  }

  private timelineAnimate(): void {
    $(".timeline.animated .timeline-row").each(function(i) {
        var bottom_of_object, bottom_of_window;
        bottom_of_object = $(this).position().top + $(this).outerHeight();
        bottom_of_window = $('#pageContent').scrollTop() + $('#pageContent').height();
        if (bottom_of_window > bottom_of_object) {
          return $(this).addClass("active");
        }
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
            description: strings.PropertyPaneDescription
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
                  baseTemplate: 106,
                  orderBy: PropertyFieldSPListQueryOrderBy.Title,
                  showOrderBy: true,
                  showMax: true,
                  showFilters: true,
                  max: 100,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'verticalTimelineQueryField'
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                 PropertyFieldIconPicker('icon', {
                  label: strings.icon,
                  initialValue: this.properties.icon,
                  orderAlphabetical: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'verticalTimelineIconField'
                }),
                PropertyFieldColorPickerMini('color', {
                  label: strings.color,
                  initialColor: this.properties.color,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'verticalTimelineColorField'
                }),
                PropertyFieldColorPickerMini('backgroundColor', {
                  label: strings.backgroundColor,
                  initialColor: this.properties.backgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'verticalTimelineBgColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
