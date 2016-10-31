/**
 * @file SimplePollWebPart.ts
 * Simple Poll Web part for SharePoint Framework SPFx
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

import * as strings from 'SimplePollStrings';
import { ISimplePollWebPartProps } from './ISimplePollWebPartProps';

import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldCustomList, CustomListFieldType } from 'sp-client-custom-fields/lib/PropertyFieldCustomList';

require('jquery');

import * as $ from 'jquery';

export default class SimplePollWebPart extends BaseClientSideWebPart<ISimplePollWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div style='font-family: ${this.properties.font}; font-size: ${this.properties.size};
      color: ${this.properties.color};'>

      <div class="SimplePollMessage">
            <p id="message">
                Poll loading...
            </p>
        </div>
	    <div class="SimplePollQuestions" style="display:none">
		    <h3 class="SimplePollTitle"></h3>
		    <div class="PollOptions">

		    </div>
		    <div>
			    <button class="ms-Button ms-Button--primary" id='SimplePollVote'>Vote</button>
			    <a href='#' id='SimplePollGoResults'>View results</a>
		    </div>
	    </div>
	    <div class="SimplePollSumarry" style="display:none">
		    <h3 class="SimplePollTitle"></h3>
		    <div class="graph" style="width:100%">
			    <table></table>
		    </div>
		    <div>
			    <button id='SimplePollGoBackVote' class="ms-Button ms-Button--primary">Vote</button>
		    </div>
	    </div>
        <div id="loading" style="display:none">
            <img src="../Images/loading.gif" alt="Loading..." />
        </div>

      </div>
    `;

    this.renderContents();
  }

  private renderContents(): void {
    //if (uservoteid >= 0) {
    //        buildPoll();
    //        viewResults();
    //    } else {
            this.buildPoll();
            $(".SimplePollMessage").hide();
            $(".SimplePollQuestions").fadeIn();
    //    }
    $("#loading").hide();
  }

  private buildPoll(): void {
    $(".SimplePollTitle").text(this.properties.question);
    if (this.properties.answers != null) {
      for (var i = 0; i < this.properties.answers.length; i++) {
          this.addOption(this.properties.answers[i]['Title'], i);
      }
    }
  }

  private addOption(title, opt): void {
    var selected = "";
    //  if (opt == uservote) selected = " selected ";
    $(".PollOptions").append("<p><label><input type='radio' name='SimplePoll' value='" + opt + "'" + selected + " />" + title + "</label></p>");
  }

/*
  private viewResults(): void {
    $(".SimplePollMessage").hide();
    $(".SimplePollQuestions").hide();
    $(".SimplePollSumarry").fadeIn(400, this.buildResults);
  }
*/
/*  private buildResults(): void {
    var i, maxvotes = 0;
    for (i = 0; i < pollconfig.options.length; i++) {
        if (pollconfig.options[i].votes > maxvotes) maxvotes = pollconfig.options[i].votes;
    }

    if (maxvotes > 0) {
        $(".graph").html("<table></table>");
        for (i = 0; i < pollconfig.options.length; i++) {
            var width = 100 * pollconfig.options[i].votes / maxvotes;
            if (width == 0) width = 2;
            $(".graph table").append("<tr><td class='title'>" + pollconfig.options[i].title +
                                      "</td><td><div class='pollbar' style='width:0' pollwidth='" + width + "'>" +
                                      pollconfig.options[i].votes + "</div></td></tr>");
        }

        $(".graph .pollbar").each(function () {
            $(this).animate({
                width: $(this).attr("pollwidth")
            }, 1000);
        });
    } else {
        $(".graph").html("<span class='novote'>No vote yet. Be the first!</span>");
    }
  }
    */

/*
  private sendVote(): void {
    $("#loading").show();
    var pollvote = $('input:radio[name=SimplePoll]:checked').val();
    if (pollvote == undefined || pollvote == "") {
        // Show message "Please select a vote"
        return;
    }
    */

/*
    if (uservote == "") {
        // User did not vote yet
        var newvote = pollvotes.addItem(new SP.ListItemCreationInformation());
        newvote.set_item("Title", loginname);
        newvote.set_item("Choice", pollvote);
        newvote.update();

        context.load(newvote);
        context.executeQueryAsync(function () {

            uservote = pollvote;
            uservoteid = newvote.get_id();

            $.each(pollconfig.options, function (key, val) {
                if (val.value == pollvote) val.votes++;
            });

            $("#loading").hide();
            this.viewResults();

        }, this.onError);
    } else {
        // Modify existing vote
        var vote = pollvotes.getItemById(uservoteid);
        vote.set_item("Choice", pollvote);
        vote.update();
        context.executeQueryAsync(function () {

            $.each(pollconfig.options, function (key, val) {
                if (val.value == pollvote) val.votes++;
                if (val.value == uservote) val.votes--;
            });

            uservote = pollvote;

            $("#loading").hide();
            this.viewResults();

        }, this.onError);
    }
*/
 /*}

  private onError(sender, args): void {
    $("#loading").hide();
    $('#message').text('Error: ' + args.get_message());

    $(".SimplePollQuestions").hide();
    $(".SimplePollSumarry").hide();
    $(".SimplePollMessage").fadeIn();
  }*/

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.EffectGroupName,
              groupFields: [
                PropertyPaneTextField('question', {
                  label: strings.TextFieldLabel,
                  multiline: false
                }),
                PropertyFieldCustomList('answers', {
                  label: strings.Answers,
                  value: this.properties.answers,
                  headerText: strings.ManageAnswers,
                  fields: [
                    { title: 'Title', required: true, type: CustomListFieldType.string }
                  ],
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldFontPicker('font', {
                  label: strings.FontFieldLabel,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldFontSizePicker('size', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.size,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldColorPicker('color', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.color,
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
