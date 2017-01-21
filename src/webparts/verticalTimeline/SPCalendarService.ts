/**
 * @file
 * Service to get list & list items from current SharePoint site
 *
 * Author: Olivier Carpentier
 */
import { ISPListItems, ISPListItem } from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { IVerticalTimelineWebPartProps } from './IVerticalTimelineWebPartProps';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import MockHttpClient from './MockHttpClient';

/**
 * @interface
 * Service interface definition
 */
export interface ISPCalendarService {
  /**
   * @function
   * Gets the pictures from a SharePoint list
   */
  getItems(libId: string): Promise<ISPListItems>;
}

/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
export class SPCalendarService implements ISPCalendarService {
  private context: IWebPartContext;
  private props: IVerticalTimelineWebPartProps;

  /**
   * @function
   * Service constructor
   */
  constructor(_props: IVerticalTimelineWebPartProps, pageContext: IWebPartContext){
      this.props = _props;
      this.context = pageContext;
  }


  /**
   * @function
   * Gets the pictures from a SharePoint list
   */
  public getItems(queryUrl: string): Promise<ISPListItems> {
    if (Environment.type === EnvironmentType.Local) {
      //If the running environment is local, load the data from the mock
      return this.getItemsFromMock('1');
    }
    else {
      //Request the SharePoint web service
      return this.context.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
          return response.json().then((responseFormated: any) => {
              var formatedResponse: ISPListItems = { value: []};
              //Fetchs the Json response to construct the final items list
              responseFormated.value.map((object: any, i: number) => {
                //Tests if the result is a file and not a folder
                if (object['FileSystemObjectType'] == '0') {
                  var spListItem: ISPListItem = {
                    'ID': object["ID"],
                    'Title': object['Title'],
                    'Description': object['Description'],
                    'EventDate': object['EventDate'],
                    'EndDate': object['EndDate'],
                    'Location': object['Location']
                  };
                  formatedResponse.value.push(spListItem);
                }
              });
              return formatedResponse;
          });
      }) as Promise<ISPListItems>;
    }
  }

  /**
   * @function
   * Gets the pictures list from the mock. This function will return a
   * different list of pics for the lib 1 & 2, and an empty list for the third.
   */
  private getItemsFromMock(libId: string): Promise<ISPListItems> {
       return MockHttpClient.getListsItems(this.context.pageContext.web.absoluteUrl).then(() => {
          var listData: ISPListItems = { value: []};
          if (libId == '1') {
            listData = {
                value:
                [
                    {
                      "ID": "1", "Title": "Barton Dam, Ann Arbor, Michigan", "Description": ""
                    },
                    {
                      "ID": "2", "Title": "Building Atlanta, Georgia", "Description": ""
                    },
                    {
                      "ID": "3", "Title": "Nice day for a swim", "Description": ""
                    },
                    {
                      "ID": "4", "Title": "The plants that never die", "Description": ""
                    },
                    {
                      "ID": "5", "Title": "Downtown Atlanta, Georgia", "Description": ""
                    },
                    {
                      "ID": "6", "Title": "Atlanta traffic", "Description": ""
                    },
                    {
                      "ID": "7", "Title": "A pathetic dog", "Description": ""
                    },
                    {
                      "ID": "8", "Title": "Two happy dogs", "Description": ""
                    },
                    {
                      "ID": "9", "Title": "Antigua, Guatemala", "Description": ""
                    },
                    {
                      "ID": "10", "Title": "Iximche, Guatemala", "Description": ""
                    }
                ]
            };
          }
          else if (libId == '2') {
            listData = {
                value:
                [
                    {
                      "ID": "11", "Title": "Barton Dam, Ann Arbor, Michigan", "Description": ""
                    },
                    {
                      "ID": "12", "Title": "Building Atlanta, Georgia", "Description": ""
                    },
                    {
                      "ID": "13", "Title": "Nice day for a swim", "Description": ""
                    },
                    {
                      "ID": "14", "Title": "The plants that never die", "Description": ""
                    },
                    {
                      "ID": "15", "Title": "Downtown Atlanta, Georgia", "Description": ""
                    },
                    {
                      "ID": "16", "Title": "Atlanta traffic", "Description": ""
                    },
                    {
                      "ID": "17", "Title": "A pathetic dog", "Description": ""
                    },
                    {
                      "ID": "18", "Title": "Two happy dogs", "Description": ""
                    },
                    {
                      "ID": "19", "Title": "Antigua, Guatemala", "Description": ""
                    },
                    {
                      "ID": "20", "Title": "Iximche, Guatemala", "Description": ""
                    }
                ]
            };
          }

          return listData;
      }) as Promise<ISPListItems>;
  }

}
