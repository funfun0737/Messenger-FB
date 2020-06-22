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

const Curation = require("./curation"),
    Order = require("./order"),
    Response = require("./response"),
    Care = require("./care"),
    OneTime = require("./onetime"),
    Request = require("request"),
    Survey = require("./survey"),
    GraphAPi = require("./graph-api"),
    i18n = require("../i18n.config");

const oneTimeToken = null;

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    console.log("HZTesst handleMessage");

    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      } else if (event.optin.type == 'one_time_notif_req' && event.optin.payload == 'NOTIFY_ME') {
        // this.oneTimeToken = event.optin.one_time_notif_token;
        responses = Response.genText(i18n.__("Ok!"));
        // console.log("YQTest" + event.optin.one_time_notif_token);
        let requestBody = {
          "recipient": {
            "one_time_notif_token": event.optin.one_time_notif_token
          },
          "message": {
            "text": "Here is the letter for you!/counselor is available!"
          }
        }
        setTimeout(() => GraphAPi.callSendAPI(requestBody), 1000*60);
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
        "Received text:",
        `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

    let message = this.webhookEvent.message.text.trim().toLowerCase();
    console.log("HZTest message "+message);

    let response;

    if (
        (greeting && greeting.confidence > 0.8) ||
        message.includes("start over")
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (message.includes("counselor")) {
      response = OneTime.sendOneTimeNoti();
    } else if (message.includes("take a survey")) {
      response = Survey.startASurvey();
    } else if (Number(message)) {
      response = Order.handlePayload("ORDER_NUMBER");
    } else if (message.includes(i18n.__("care.help").toLowerCase())) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload("CARE_HELP");
    }
    else if (message.includes("yuki")) {
      this.sendPassThread(this.user.psid);
    }
    else {
      response = [
        Response.genText(
            i18n.__("fallback.any", {
              message: this.webhookEvent.message.text
            })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("menu.suggestion"),
            payload: "CURATION"
          },
          {
            title: i18n.__("menu.help"),
            payload: "CARE_HELP"
          }
        ])
      ];
    }

    return response;
  }

  sendPassThread(senderId) {
    Request(
        {
          uri: "https://graph.facebook.com/v2.6/me/pass_thread_control",
          qs: { access_token: "EAAEedv38DeYBAECCJnYz8ZAl4wZCVt5BZBzV2CI8K52ZApk9kyUfOFsnDIWBu3atvp9ZAi7qocIAmglm7axERtADYOnOIM7Bs9En08Q3NXjmMKEWM6mX0S3lFlenhsX3tB3lBrpACFCrXXMZA550WEw5732KnodHwwaJdmuHFa7LZAnaIaJL2aD" },
          method: "POST",
          json: {
            recipient: {
              id: senderId
            },
            target_app_id: 832298603845523
          }
        },
        (err, res, body) => {
          if (err || body.error) {
            console.log("UNABLE TO SEND PASS THREAD REQUEST", err || body.error);
          } else {
            console.log("PASSED THREAD TO MESSAGE DASHBOARD BOT");
          }
        }
    );
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    let response;

    // Set the response based on the payload
    if (
        payload === "GET_STARTED" ||
        payload === "DEVDOCS" ||
        payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    }
    if (payload.startsWith("SURVEY")) {
      response = Survey.handlePayload(payload);
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
        i18n.__("get_started.survey");

    let response = Survey.startASurvey();

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }

};