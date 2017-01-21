/**
 * @file
 * Service to get list & list items from current SharePoint site
 *
 * Author: Olivier Carpentier
 */
import { ISPListItems, ISPListItem } from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { ISimplePollWebPartProps } from './ISimplePollWebPartProps';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

import MockHttpClient from './MockHttpClient';

/**
 * @interface
 * Service interface definition
 */
export interface ISPSurveyService {
  /**
   * @function
   * Gets the question from a SharePoint list
   */
  getQuestions(libId: string): Promise<ISPListItems>;
  getResults(surveyListId: string, question: string, choices: string[]): Promise<number[]>;
  postVote(surveyListId: string, question: string, choice: string): Promise<boolean>;
}

/**
 * @class
 * Service implementation to get list & list items from current SharePoint site
 */
export class SPSurveyService implements ISPSurveyService {
  private context: IWebPartContext;
  private props: ISimplePollWebPartProps;

  /**
   * @function
   * Service constructor
   */
  constructor(_props: ISimplePollWebPartProps, pageContext: IWebPartContext){
      this.props = _props;
      this.context = pageContext;
  }

  public getResults(surveyListId: string, question: string, choices: string[]): Promise<number[]> {
      var restUrl: string = this.context.pageContext.web.absoluteUrl;
      restUrl += "/_api/Web/Lists(guid'";
      restUrl += surveyListId;
      restUrl += "')/items?$select=" + question + "&$top=9999";

      return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
          return response.json().then((responseFormated: any) => {

            var res: number[] = [];
            for (var c = 0; c < choices.length; c++)
              res[c] = 0;

            var collection = responseFormated.value;
            for (var i = 0; i < collection.length; i++) {
              var vote = collection[i][question];
              var qIndex = choices.indexOf(vote);
              res[qIndex]++;
            }

            return res;
        });
      }) as Promise<number[]>;
  }

  public postVote(surveyListId: string, question: string, choice: string): Promise<boolean> {

    return this.getListName(surveyListId).then((listName: string) => {

      var restUrl: string = this.context.pageContext.web.absoluteUrl;
      restUrl += "/_api/Web/Lists(guid'";
      restUrl += surveyListId;
      restUrl += "')/items";

      var item = {
          "__metadata": { "type": this.getItemTypeForListName(listName) },
          "Title": "newItemTitle"
      };
      item[question] = choice;

      var options: ISPHttpClientOptions = {
        headers: {
          "odata-version": "3.0",
          "Accept": "application/json"
        },
        body: JSON.stringify(item),
        webUrl: this.context.pageContext.web.absoluteUrl
      };
      return this.context.spHttpClient.post(restUrl, SPHttpClient.configurations.v1, options).then((response: SPHttpClientResponse) => {
        return response.json().then((responseFormated: any) => {
          return true;
        });
      }) as Promise<boolean>;

    }) as Promise<boolean>;
  }

  private getListName(listId: string): Promise<string> {
    var restUrl: string = this.context.pageContext.web.absoluteUrl;
    restUrl += "/_api/Web/Lists(guid'";
    restUrl += listId;
    restUrl += "')?$select=Title";
    var options: ISPHttpClientOptions = {
      headers: {
        "odata-version": "3.0",
        "Accept": "application/json"
      }
    };
    return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1, options).then((response: SPHttpClientResponse) => {
        return response.text().then((responseFormated: string) => {
            var iTitle = responseFormated.indexOf("<d:Title>");
            var newStr = responseFormated.slice(iTitle + 9, responseFormated.length);
            newStr = newStr.slice(0, newStr.indexOf("</d:Title>"));
            return newStr;
        });
    });
  }

  private getItemTypeForListName(name: string): string {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
  }

  public getVoteForUser(surveyListId: string, question: string, userEmail: string): Promise<ISPListItems> {

    var restUrl: string = this.context.pageContext.web.absoluteUrl;
    restUrl += "/_api/Web/Lists(guid'";
    restUrl += surveyListId;
    restUrl += "')/items?$expand=Author&$select=" + question + ",Author/EMail&$top=999";

     return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
          return response.json().then((responseFormated: any) => {
              var formatedResponse: ISPListItems = { value: []};
              //Fetchs the Json response to construct the final items list
              responseFormated.value.map((object: any, i: number) => {

                var authorEmail = object['Author'].EMail;
                if (authorEmail == userEmail) {
                  var spListItem: ISPListItem = {
                      'ID': '',
                      'Title': object[question]
                  };
                  formatedResponse.value.push(spListItem);
                }
              });
              return formatedResponse;
          });
      }) as Promise<ISPListItems>;
  }

  /**
   * @function
   * Gets the survey questions from a SharePoint list
   */
  public getQuestions(surveyListId: string): Promise<ISPListItems> {
    if (Environment.type === EnvironmentType.Local) {
      //If the running environment is local, load the data from the mock
      return this.getItemsFromMock('1');
    }
    else {
      //Request the SharePoint web service
      var restUrl: string = this.context.pageContext.web.absoluteUrl;
      restUrl += "/_api/Web/Lists(guid'";
      restUrl += surveyListId;
      restUrl += "')/fields?$filter=(CanBeDeleted%20eq%20true)&$top=1";

      return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
          return response.json().then((responseFormated: any) => {
              var formatedResponse: ISPListItems = { value: []};
              //Fetchs the Json response to construct the final items list
              responseFormated.value.map((object: any, i: number) => {
                //Tests if the result is a file and not a folder
                var spListItem: ISPListItem = {
                    'ID': object["ID"],
                    'Title': object['Title'],
                    'StaticName': object['StaticName'],
                    'TypeAsString': object['TypeAsString'],
                    'Choices': object['Choices']
                };
                formatedResponse.value.push(spListItem);
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
