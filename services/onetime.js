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
    i18n = require("../i18n.config");
const oneYearToken = null;
const timeStamp = null;
module.exports = class onetime {
    static sendOneTimeNoti() {
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "one_time_notif_req",
                    "title": "when counselor is available",
                    "payload": "NOTIFY_ME"
                }
            }
        }
    }

    static followup(event) {
        this.payload = event.payload;
        this.oneYearToken = event.option.one_time_notif_token;
        this.timeStamp = event.timeStamp;
        if (true) {
            console.log("YQTEST followup");
            return {
                "recipient": {
                    "one_time_notif_token": "oneYearToken"
                },
                "message": {
                    "text": "avaiable!"
                }
            }
        }
    };
}

