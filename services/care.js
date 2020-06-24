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
  Survey = require("./survey"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Care {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload() {
    return [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaCare.name,
              topic: i18n.__("care.order")
            }),
            config.personaOrder.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaOrder.id
          ),
          Survey.genAgentRating(config.personaOrder.name)
        ];
    }
};
