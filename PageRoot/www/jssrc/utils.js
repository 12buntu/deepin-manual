"use strict";

let urlparse = require("url-parse");

let splitPathFileNames = function(pf) {
    let i = pf.lastIndexOf("/");
    if (i >= 0) {
        return [pf.substr(0, i), pf.substr(i)];
    } else {
        throw new Error(`Cannot split: ${pf}`);
    }
};

let getPathCombinator = function(type) {
    return function(indexPath){
        let parsed = urlparse(indexPath);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return [parsed.protocol + "/", parsed.host + splitPathFileNames(parsed.pathname)[0], "style"].join("/");
        } else if (parsed.protocol === "file:" || parsed.protocol === "") {
            return ["file:/", splitPathFileNames(parsed.pathname)[0], type].join("/");
        } else {
            throw new Error("Unknown protocol.");
        }
    }
};

let getContentStylePath = getPathCombinator("style");

let getScriptPath = getPathCombinator("scripts");

let searchHighlight = function(text, keywords) {
    if (keywords.length === 0) {
        return "";
    }
    let pattern = [];
    for (let keyword of keywords) {
        keyword = keyword.replace(/\\/g, '\\\\');
        pattern.push(keyword.replace(/([[^$.|?*+(){}])/g, '\\$1'));
    }
    pattern = "(?:" + pattern.join(")|(?:") + ")";
    pattern = new RegExp(pattern, "gi");

    let foundFlag = false;
    let result = text.replace(pattern, function(match){
        foundFlag = true;
        return `<span class="highlight">${match}</span>`;
    });
    return foundFlag ? result : "";
};

let highlight = function(text, keywords) {
    if (keywords.length === 0) {
        return text;
    }
    let pattern = [];
    for (let keyword of keywords) {
        keyword = keyword.replace(/\\/g, '\\\\');
        pattern.push(keyword.replace(/([[^$.|?*+(){}])/g, '\\$1'));
    }
    pattern = "(?:" + pattern.join(")|(?:") + ")";
    pattern = new RegExp(pattern, "gi");
    let result = text.replace(pattern, function(match){
        return `<span class="highlight">${match}</span>`;
    });
    return result;
};

/**
 * (Used in angular filter: filterHighlight)
 * @param filtered an array of AnchorItem's.
 * @param anchorId string
 * @returns {*}
 */
let getAnchorItem = function(filtered, anchorId) {
    for (let item of filtered) {
        if (item.anchorId === anchorId) {
            return item;
        }
    }
    return null;
};

let bound = function(min, value, max) {
    if ((min <= value) && (value <= max)) {
        return value;
    }
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    throw new Error("Cannot bound");
};

if (typeof exports !== "undefined") {
    exports.searchHighlight = searchHighlight;
    exports.highlight = highlight;
    exports.getContentStylePath = getContentStylePath;
    exports.getScriptPath = getScriptPath;
    exports.getAnchorItem = getAnchorItem;
    exports.bound = bound;
}
