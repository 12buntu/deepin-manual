"use strict";

let {
    processMarkdown,
} = require("../renderer");

let {
    getContentStylePath,
    getScriptPath,
} = require("../utils");


angular.module("DManual")
    .factory("MarkdownService", function($log, $rootScope, $window,
                                         GInput, GSynonym, AdapterService) {
        let stylePath = getContentStylePath($window.location.href);
        let scriptPath = getScriptPath($window.location.href);
        let _getFullHtml = function(html, markdownDir) {
            const base = `<base href='${markdownDir}/'>
                <script src="${scriptPath}/mousetrap.js"></script>
                <script>
                'use strict';
                var disallow = function(event) {
                    event.preventDefault();
                    return false;
                };
                var emitEvent = function(eventName, eventMsg) {
                    var e = new CustomEvent(eventName, {detail: eventMsg});
                    window.parent.dispatchEvent(e);
                };
                window.onload = function() {
                    var body = document.body;
                    body.addEventListener("dragenter", disallow);
                    body.addEventListener("dragover", disallow);
                    body.addEventListener("dragend", disallow);
                    body.addEventListener("dragleave", disallow);
                    body.addEventListener("drop", disallow);
                };
                Mousetrap.bind('ctrl+f', function() {
                    emitEvent("IFrameShowEventProxy", {
                        reason: "contentframe-shortcut",
                    });
                });
                Mousetrap.bind('esc', function() {
                    emitEvent("searchBoxHideEvent", {
                        reason: "contentframe-shortcut",
                    });
                });

                // hashchange will trigger a scroll event
                // This is not desired because it breaks the behavior
                var _hashJustChanged = false;
                window.addEventListener("hashchange", function(e) {
                    _hashJustChanged = true;
                });
                document.addEventListener('scroll', function(e) {
                    setTimeout(function() {
                        // workaround: DAE hashchange triggers after scroll
                        if (_hashJustChanged) {
                            _hashJustChanged = false;
                        } else {
                            emitEvent("searchBoxHideEvent", {
                                reason: "contentframe-scroll",
                            });
                        }
                    }, 0);
                    emitEvent("navigationRelocateEvent", {offset: window.scrollY});
                    emitEvent("contentScrollEvent");
                });
                window.addEventListener("click", function() {
                    emitEvent("searchBoxHideEvent", {
                        reason: "contentframe-click",
                    });
                });
                </script>
                <link rel='stylesheet' href='${stylePath}/reset.css' />
                <link rel='stylesheet' href='${stylePath}/content.css' />`;
            const footer = `<footer class="__spaceholder"></footer>`;
            return base + html + footer;
        };


        // hold processed html code
        let _initialized = false;
        let _html = "";
        let _anchors = [];
        let _appInfo = Object.create(null);
        let _indices = [];
        let _headers = [];

        let _load = function(markdownDir) {
            // Load synonyms
            GInput.load(`${markdownDir}/synonym.txt`).then(function(text) {
                let lines = text.split("\n");
                let wordsList = [];
                nextLine: for (let line of lines) {
                    let words = line.split("|")
                        .filter(word => word.trim());
                    if (words) {
                        wordsList.push(words);
                    }
                }
                GSynonym.init(wordsList.filter(words => words.length > 0));
            }, function(error) {
                $log.warn(`Cannot load synonyms ${error}`);
                GSynonym.init([]);
            });

            GInput.load(`${markdownDir}/index.md`).then(function(mdText) {
                let result = processMarkdown(mdText);
                _html = _getFullHtml(result.html, markdownDir);

                let parsed = result.parsed;

                _anchors = parsed.anchors;
                _appInfo = parsed.appInfo;
                _indices = parsed.indices;
                _headers = parsed.headers;

                AdapterService.registerPinyin(_headers);
                _appInfo.markdownDir = markdownDir;
                _initialized = true;
                $rootScope.$broadcast("MarkdownProcessed");
            }, function(error) {
                $log.error(`Markdown::load failed: ${error}`);
            });
        };

        let _markdownDir = AdapterService.markdownDir();
        if (_markdownDir) {
            _load(_markdownDir);
        }
        $rootScope.$on("markdownDirChanged", function(event, markdownDir) {
            _load(markdownDir);
        });


        let _getHtml = function() {
            if (!_html) {
                $log.warn("MarkdownService does not have html yet.");
            }
            return _html;
        };

        return {
            getHtml: _getHtml,
            getHeaders: () => _headers,
            getIndices: () => _indices,
            getAnchors: () => _anchors,
            getAppInfo: () => _appInfo,
            isInitialized: () => _initialized,
        }
    });
