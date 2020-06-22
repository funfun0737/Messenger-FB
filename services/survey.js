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
  i18n = require("../i18n.config"),
config = require("./config");
module.exports = class Survey {
  // static genAgentRating(agent) {
  //   let response = Response.genQuickReply(
  //     i18n.__("survey.prompt", {
  //       agentFirstName: agent
  //     }),
  //     [
  //       {
  //         title: "\uD83D\uDE00",
  //         payload: "CSAT_GOOD"
  //       },
  //       {
  //         title: "\uD83D\uDE42",
  //         payload: "CSAT_AVERAGE"
  //       },
  //       {
  //         title: "\uD83D\uDE41",
  //         payload: "CSAT_BAD"
  //       }
  //     ]
  //   );
  //
  //   // This is triggered 4 sec after comming back from talking with an agent
  //   response.delay = "4000";
  //
  //   return response;
  // }

  static startASurvey(){
    return Response.genQuickReply("Let's take a survey!", [
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
    // let response;
    //   switch (payload) {
    //     case "ANATO":
    //       response = [
    //           Response.genImageTemplate(
    //           `${config.appUrl}/order.png`,
    //           i18n.__("order.status")
    //       ),
    //         Response.genQuickReply("What is your gender assigned at birth?", [
    //                     {
    //                       title: "Male",
    //                       payload: "SURVEY_1_MALE"
    //                     },
    //                     {
    //                       title: "Intersex",
    //                       payload: "SURVEY_1_INTER"
    //                     },
    //                     {
    //                       title: "Female",
    //                       payload: "SURVEY_1_FEMALE"
    //                     }])
    //       ]
    //       break;
    //
    //   }

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
            `${config.appUrl}/anato.png`,
            i18n.__("gender expression")
              ),
              Response.genQuickReply("Rank your female-ness ", [
            {
              title: "0",
              payload: "SURVEY_2_0"
            },
            {
              title: "1",
              payload: "SURVEY_2_1"
            }])];

    }
  }
};
