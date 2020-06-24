/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Imports dependencies
const Response = require("./response"),
    OneTime = require("./onetime"),
  i18n = require("../i18n.config"),
config = require("./config");
module.exports = class Survey {
  static genAgentRating(agent) {
    let response = Response.genQuickReply(
      i18n.__("survey.prompt", {
        agentFirstName: agent
      }),
      [
        {
          title: "\uD83D\uDE00",
          payload: "CSAT_GOOD"
        },
        {
          title: "\uD83D\uDE42",
          payload: "CSAT_AVERAGE"
        },
        {
          title: "\uD83D\uDE41",
          payload: "CSAT_BAD"
        }
      ]
    );

    // This is triggered 4 sec after comming back from talking with an agent
    response.delay = "4000";

    return response;
  }

  static startASurvey(){
    return Response.genQuickReply(" Let's take a survey!", [
      {
        title: "Take a survey",
        payload: "SURVEY_0_YES"
      },
      {
        title: "Maybe later",
        payload: "SURVEY_0_NO"
      }
    ]);
  }

  static handlePayload(payload) {

    let mark0 = payload.indexOf("_", 0);
    let mark1 = payload.indexOf("_", mark0+1);

    let questionNumber = payload.substring(mark0+1, mark1);
    let choice = payload.substring(mark1+1);

    switch (questionNumber) {
      case "0":
        switch (choice) {
          case "YES":
            return Response.genQuickReply("What is your gender assigned at birth?", [
              {
                title: "Male",
                payload: "SURVEY_1_MALE"
              },
              {
                title: "Intersex",
                payload: "SURVEY_1_INTER"
              },
              {
                title: "Female",
                payload: "SURVEY_1_FEMALE"
              }]);
          case "NO":
            return Response.genText("Thank you, bye.");
          default: break;
        }
      case "1":
          return [
              Response.genImageTemplate(
                  `${config.appUrl}/Expression.png`,
                  i18n.__("gender expression")
              ),
              Response.genQuickReply("Please rank your female-ness ", [
            {
              title: "0",
              payload: "SURVEY_2_0"
            },
            {
              title: "1",
              payload: "SURVEY_2_1"
            },
                {
                  title: "2",
                  payload: "SURVEY_2_1"
                },
                {
                  title: "3",
                  payload: "SURVEY_2_1"
                },
                {
                  title: "4",
                  payload: "SURVEY_2_1"
                },
                {
                  title: "5",
                  payload: "SURVEY_2_1"
                },

            ])];
      case "2":
        return Response.genQuickReply("This is the end of survey, if you have confusion, would you like to talk to a counselor?", [
            {
              title: "Sure",
              payload: "SURVEY_100_YES"
            },
            {
              title: "Maybe later",
              payload: "SURVEY_100_NO"
            }]);
      case "100":
        switch (choice) {
          case "YES":
            return [
                Response.genText("We are finding the best counselor for you."),
              Response.genText("Do you want to get notified when your counselor is available?"),
              OneTime.sendOneTimeNoti()
            ];
          case "NO":
            return Response.genText("Have a nice day, see you!");
        }
    }
  }

};
