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

    static startASurvey() {
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
        let mark1 = payload.indexOf("_", mark0 + 1);

        let questionNumber = payload.substring(mark0 + 1, mark1);
        let choice = payload.substring(mark1 + 1);

        switch (questionNumber) {
            case "0":
                switch (choice) {
                    case "YES":
                        return Response.genQuickReply("To start with, what is your gender assigned at birth?", [
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
                    default:
                        break;
                }
            case "1":
                return [
                    Response.genImageTemplate(
                        `${config.appUrl}/1.png`,
                        i18n.__("we invite you to rank femaleness and maleness using two continuums"),
                    ),
                    Response.genQuickReply("First, please rank your female-ness ", [
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
                return [
                    Response.genQuickReply("Please rank your male-ness ", [
                        {
                            title: "0",
                            payload: "SURVEY_3_0"
                        },
                        {
                            title: "1",
                            payload: "SURVEY_3_1"
                        },
                        {
                            title: "2",
                            payload: "SURVEY_3_1"
                        },
                        {
                            title: "3",
                            payload: "SURVEY_3_1"
                        },
                        {
                            title: "4",
                            payload: "SURVEY_3_1"
                        },
                        {
                            title: "5",
                            payload: "SURVEY_3_1"
                        },

                    ])];
            case "3":
                return [
                    Response.genGenericTemplate(
                        `${config.appUrl}/2.png`,
                        i18n.__("examples of different gender expressions and possible labels"),
                        i18n.__("If you want to know more about this, check this website"),
                        [Response.genWebUrlButton(
                            i18n.__("gender expression"),
                            `https://www.genderbread.org/wp-content/uploads/2017/02/Breaking-through-the-Binary-by-Sam-Killermann.pdf`
                        )]
                    ),

                    Response.genQuickReply("Do you want to check the next dimension: Gender Identity ? ", [
                        {
                            title: "next",
                            payload: "SURVEY_4_0"
                        },
                        {
                            title: "maybe later",
                            payload: "SURVEY_4_0"
                        }])
                ];
            case "4":

                return Response.genQuickReply("This is the end of survey, would you like to talk to a counselor?", [
                    {
                        title: "Yes",
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
