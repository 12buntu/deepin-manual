"use strict";

let {
    searchHighlight,
    getAnchorItem,
} = require("./utils");

let app = angular.module("DManual", ["General", "gettext", "ngAnimate", "cfp.hotkeys"]);
if (typeof window !== "undefined") {
    window.$ = require("jquery");
}

app.filter("filterHighlight", function($log, $sce) {
    let _PLACEHOLDER_RESULT = [];
    let lastTerm = null;
    let cached = null;
    return function(indices, searchTerm, keywords) {
        $log.log(`searchTerm: ${searchTerm}\nkeywords: ${keywords}`);
        let result = [];
        if (!searchTerm) {
            return _PLACEHOLDER_RESULT;
        }
        if ((searchTerm === lastTerm) && cached) {
            return cached;
        }
        nextHeader: for (let index of indices) {
            let texts = index.texts;
            nextText: for (let text of texts) {
                text = searchHighlight(text, keywords);
                if (text) {
                    let anchorItem = getAnchorItem(result, index.headerId);
                    if (!anchorItem) {
                        result.push({
                            anchorId: index.headerId,
                            anchorText: index.headerText,
                            texts: "",
                        });
                        anchorItem = result[result.length - 1];
                    }
                    anchorItem.texts += text;
                }
                continue nextHeader;
            }
        }
        result.map(function(anchorItem) {
            anchorItem.texts+= "<span class=\"ellipsis\">...</span>";
            anchorItem.texts = $sce.trustAsHtml(anchorItem.texts);
        });
        lastTerm = searchTerm;
        cached = result;
        return cached;
    }
});
