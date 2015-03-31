"use strict";

let Renderer = require("../www/jssrc/renderer");
let expect = require("expect.js");

let r = Renderer.getHTMLRenderer();
let pr = Renderer.getPlainRenderer();
let p = Renderer.processMarkdown;

describe("Markdown HTML Renderer", function() {
    describe("Headers", function() {
        it("understands h1 - h3", function() {
            let result = r.heading("This is a test", 1, "This is a test");
            expect(result).to.equal('<h1 id="This-is-a-test">This is a test</h1>\n');

            result = r.heading("This is header2", 2, "This is header2");
            expect(result).to.equal('<h2 id="This-is-header2">This is header2</h2>\n');

            result = r.heading("This is header3", 3, "This is header3");
            expect(result).to.equal('<h3 id="This-is-header3">This is header3</h3>\n');
        });

        it("understands h4 - h6", function() {
            let result = r.heading("Header4", 4, "Header4");
            expect(result).to.equal('<h4>Header4</h4>\n');

            result = r.heading("Header5", 5, "Header5");
            expect(result).to.equal('<h5>Header5</h5>\n');

            result = r.heading("Header6", 6, "Header6");
            expect(result).to.equal('<h6>Header6</h6>\n');
        });

        it("warns about duplicate anchors", function() {
            let src = "# Hello World\n##Hello  World\n";
            expect(p).withArgs(src).to.throwError();
        });

        it("warns about redefinition of titles", function() {
            let src = "# Hello World\n# 你好世界\n";
            expect(p).withArgs(src).to.throwError();
        });

        describe("insists about the header hierarchy", function() {
            it("h2 under h1", function() {
                let src = "## H2";
                expect(p).withArgs(src).to.throwError();
            })

        })
    });

    describe("Images & Icons", function() {
        describe("Icons in headers", function() {
            it("gives h1 icons", function() {
                let src = "# H1|1.png|\n";
                let result = p(src).html;
                expect(result).to.equal('<h1 id="H1"><img class="HeaderIcon" src="1.png" />H1</h1>\n');
            });

            it("gives h2 icons", function() {
                let src = "# H1\n## H2|2.png|\n";
                let result = p(src).html;
                expect(result).to.equal('<h1 id="H1">H1</h1>\n<h2 id="H2"><img class="HeaderIcon" src="2.png" />H2</h2>\n');
            });

            it("doesn't give h3 - h6 icons", function() {
                {
                    let src = "# H1\n## H2\n### H3|3.png|\n";
                    let result = p(src).html;
                    expect(result).to.equal(
                        '<h1 id="H1">H1</h1>\n' +
                        '<h2 id="H2">H2</h2>\n' +
                        '<h3 id="H3-3.png-">H3|3.png|</h3>\n'
                    );
                }
                {
                    let src = "#### H4|4.png|\n";
                    let result = p(src).html;
                    expect(result).to.equal(
                        '<h4>H4|4.png|</h4>\n'
                    );
                }
                {
                    let src = "##### H5|5.png|\n";
                    let result = p(src).html;
                    expect(result).to.equal(
                        '<h5>H5|5.png|</h5>\n'
                    );
                }
                {
                    let src = "###### H6|6.png|\n";
                    let result = p(src).html;
                    expect(result).to.equal(
                        '<h6>H6|6.png|</h6>\n'
                    );
                }
            });
        });

        it("understands inline icons", function() {
            let src = "![Alt](alt.png)";
            let result = p(src).html;
            expect(result).to.equal(
                '<p><img src="alt.png" alt="Alt" class="inline"></p>\n')
        });

        it("understands images", function() {
            {
                let src = "![1|Alt](alt.png)";
                let result = p(src).html;
                expect(result).to.equal(
                    '<p><img src="alt.png" alt="Alt" class="block1"></p>\n')
            }
            {
                let src = "![2|Alt](alt.png)";
                let result = p(src).html;
                expect(result).to.equal(
                    '<p><img src="alt.png" alt="Alt" class="block2"></p>\n')
            }
            {
                let src = "![3|Alt](alt.png)";
                let result = p(src).html;
                expect(result).to.equal(
                    '<p><img src="alt.png" alt="Alt" class="block3"></p>\n')
            }
        });

        it("understands non-autosized images", function() {
            let src = "![0|Alt](alt.png)";
            let result = p(src).html;
            expect(result).to.equal(
                '<p><img src="alt.png" alt="Alt"></p>\n')
        });
    });

    describe("Links", function() {
        it("understands in-page links", function() {
            let src = "[Link Description](#Test)";
            let result = p(src).html;
            expect(result).to.equal(
                '<p><a href="javascript: window.parent.jumpTo(\'Test\');">Link Description</a></p>\n'
            );
        });

        it("understands external dman pages", function() {

        });

        it("emits dbus signal", function() {

        });

        it("runs command", function() {

        });
    });
});

describe("Markdown Plain Renderer", function() {
    it("outputs nothing for headers", function() {
        {
            let result = pr.heading("This is a test", 1, "This is a test");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test", 2, "This is a test");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test", 3, "This is a test");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test", 4, "This is a test");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test", 5, "This is a test");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test", 6, "This is a test");
            expect(result).to.equal("");
        }
    });

    it("outputs nothing with header even with icons", function() {
        {
            let result = pr.heading("This is a test|a.png|", 1, "This is a test|a.png|");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test|a.png|", 2, "This is a test|a.png|");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test|a.png|", 3, "This is a test|a.png|");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test|a.png|", 4, "This is a test|a.png|");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test|a.png|", 5, "This is a test|a.png|");
            expect(result).to.equal("");
        }
        {
            let result = pr.heading("This is a test|a.png|", 6, "This is a test|a.png|");
            expect(result).to.equal("");
        }
    });

    it("outputs the alt text for non-header images/icons", function() {
        { // self-sized
            let src = "![This is an alt!](./hello.png)\n";
            let result = p(src).plain;
            expect(result).to.equal('<p>This is an alt!</p>\n');
        }
        {
            let src = "![0|This is an alt!](./hello.png)\n";
            let result = p(src).plain;
            expect(result).to.equal('<p>This is an alt!</p>\n');
        }
        {
            let src = "![1|This is an alt!](./hello.png)\n";
            let result = p(src).plain;
            expect(result).to.equal('<p>This is an alt!</p>\n');
        }
        {
            let src = "![2|This is an alt!](./hello.png)\n";
            let result = p(src).plain;
            expect(result).to.equal('<p>This is an alt!</p>\n');
        }
        {
            let src = "![3|This is an alt!](./hello.png)\n";
            let result = p(src).plain;
            expect(result).to.equal('<p>This is an alt!</p>\n');
        }
    });

    it("outputs text only for tables", function() {

    });
});

describe("Navigation Parsing", function() {
    it("can do this sample", function() {
        let src = [
            "# H1|H1.png|",
            "## H2|H2.png|",
            "H2 Text",
            "### H3",
            "H3 Text",
            "## H2a|H2a.png|",
            "## H2b",
            "### H3a",
            "#### H4",
            "H4 Text",
        ].join("\n");
        let result = p(src).parsed;
        expect(result.appInfo.name).to.equal("H1");
        expect(result.appInfo.icon).to.equal("H1.png");
        expect(result.anchors).to.eql([
            {
                "id": "H2",
                "children": [
                    {
                        "id": "H3",
                        "children": [],
                        "icon": null,
                        "text": "H3"
                    }
                ],
                "icon": "H2.png",
                "text": "H2"
            },
            {
                "id": "H2a",
                "children": [],
                "icon": "H2a.png",
                "text": "H2a",
            },
            {
                "id": "H2b",
                "children": [
                    {
                        "id": "H3a",
                        "children": [],
                        "icon": null,
                        "text": "H3a"
                    }
                ],
                "icon": null,
                "text": "H2b",
            }
        ]);
        expect(result.indices).to.eql([
            { headerId: 'H2', headerText: 'H2', texts: [ 'H2 Text' ] },
            { headerId: 'H3', headerText: 'H3', texts: [ 'H3 Text' ] },
            { headerId: 'H4', headerText: 'H4', texts: [ 'H4 Text' ] },
        ]);
        expect(result.headers).to.eql([ 'H1', 'H2', 'H2a', 'H2b' ]);
    });
});

describe("Indexing", function() {

});
