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
        let unused = true;
        let payload = event.payload;
        let oneYearToken = event.option.one_time_notif_token;

        if (unused) {
            console.log("YQTEST followup");
            unused = false;
            return {
                "recipient": {
                    "one_time_notif_token": oneYearToken
                },
                "message": {
                    "text": "avaiable!"
                }
            }
        }
    };
}

