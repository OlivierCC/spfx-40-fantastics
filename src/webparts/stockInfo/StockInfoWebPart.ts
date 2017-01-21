/**
 * @file
 * Stock Info Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'StockInfoStrings';
import { IStockInfoWebPartProps } from './IStockInfoWebPartProps';

export default class StockInfoWebPart extends BaseClientSideWebPart<IStockInfoWebPartProps> {

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

    if (this.properties.stock == null || this.properties.stock == '') {
      var error = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectStock}
            </div>
          </div>
        </div>
      `;
      this.domElement.innerHTML = error;
      return;
    }

    var html = '<img src="//chart.finance.yahoo.com/t?s=' + this.properties.stock + '&amp;lang=' + this.properties.lang + '&amp;region=' + this.properties.region + '&amp;width=' + this.properties.width + '&amp;height=' + this.properties.height + '" alt="" width="' + this.properties.width + '" height="' + this.properties.height + '">';

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
                PropertyPaneTextField('stock', {
                  label: strings.Stock
                }),
                PropertyPaneSlider('width', {
                  label: strings.Width,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneSlider('height', {
                  label: strings.Height,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                 PropertyPaneTextField('lang', {
                  label: strings.Lang
                }),
                PropertyPaneTextField('region', {
                  label: strings.Region
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
