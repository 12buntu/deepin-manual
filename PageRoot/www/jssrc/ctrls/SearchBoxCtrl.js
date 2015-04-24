"use strict";

let Keyboard = {
    ENTER: 13,
    KEY_UP: 38,
    KEY_DOWN: 40
};

angular.module("DManual").controller("SearchBoxCtrl",
    function($scope, $rootScope, $animate, $timeout, $log, $sce, $window, AdapterService) {
        // Auto-complete
        $scope.headers = [];
        $scope.currentIndex = -1;

        $scope.$on("headersSet", function(event, value) {
            $log.log("Headers changed to", value);
            $scope.headers = value;
        });
        Object.defineProperty($scope, "completionList", {
            get: () => [].slice.call(document.querySelector("#Suggestions").children)
        });
        $scope.completionUp = function(){
            if($scope.currentIndex == -1) {
                $scope.currentIndex = $scope.completionList.length - 1;
            } else {
                $scope.currentIndex--;
            }
        };
        $scope.completionDown = function(){
            if($scope.currentIndex == $scope.completionList.length - 1) {
                $scope.currentIndex = -1;
            } else {
                $scope.currentIndex++;
            }
        };

        // do search
        $scope.doSearch = function($innerScope, $event){
            if ($event.keyCode === Keyboard.ENTER) {
                $event.preventDefault();
                if ($scope.currentIndex == -1) {
                    $rootScope.$broadcast("searchTermChanged", $scope.searchTerm);
                    let body = angular.element(document.body);
                    body.addClass('pageview-mode');
                    body.removeClass('overview-mode');
                } else {
                    window.jumpTo($scope.completionValue);
                }
                document.querySelector('#SearchInput').blur();
            }
            if ($event.keyCode === Keyboard.KEY_UP) {
                $event.preventDefault();
                $scope.completionUp();
                angular.element($scope.completionList).removeClass('active');
                angular.element($scope.completionList[$scope.currentIndex]).addClass('active')
                if ($scope.currentIndex !== -1) {
                    $scope.completionValue = $scope.completionList[$scope.currentIndex].children[0].title
                }
            } else if ($event.keyCode === Keyboard.KEY_DOWN) {
                $event.preventDefault();
                $scope.completionDown();
                angular.element($scope.completionList).removeClass('active');
                angular.element($scope.completionList[$scope.currentIndex]).addClass('active')
                if ($scope.currentIndex !== -1) {
                    $scope.completionValue = $scope.completionList[$scope.currentIndex].children[0].title
                }
            } else {
                $scope.currentIndex = -1;
            }
        };

        // search suggestions
        $scope.$watch("searchTerm", function(value){
            if (value) {
                let pattern = new RegExp("(?:" +
                value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
                + ")", 'gi');
                let resultList = $scope.headers.map(function(text) {
                    let found = false;
                    let highlighted = text.replace(pattern, function(word) {
                        found = true;
                        return `<span class="highlight">${word}</span>`;
                    });
                    if (found) {
                        return `<li><a href="javascript:jumpTo('${text}');" title="${text}">${highlighted}</a></li>`;
                    } else {
                        return false;
                    }
                });
                $scope.suggestions = $sce.trustAsHtml(resultList.filter(function(li) {
                    return !!li;
                }).join("\n"));
            } else {
                $scope.suggestions = "";
            }
        });

        // show-hide logic
        let _searchInput = document.getElementById("SearchInput");
        let _searchInputVisible = false; // if searchInput is visible in page view
        Object.defineProperty($scope, "searchInputVisible", {
            get: () => _searchInputVisible,
            set: function(newValue) {
                if (newValue === _searchInputVisible) {
                    return;
                }
                if (newValue) {
                    $log.log("Show SearchBox");
                    $animate.addClass(_searchInput, "slidedown");
                    _searchInput.focus();
                    _searchInputVisible = true;

                } else {
                    $log.log("Hide SearchBox");
                    $animate.removeClass(_searchInput, "slidedown");
                    _searchInput.blur();
                    _searchInputVisible = false;
                }
                try {
                    // sometimes multiple applies will occur
                    $scope.$digest();
                } catch (e) {};
            },
        });

        $scope.$on("showSearchBox", function() {
            // activate from everything other than iframe#Content
            $scope.searchInputVisible = true;
        });

        $scope.$on("hideSearchBox", function() {
            // activate from everything other than iframe#Content
            $scope.searchInputVisible = false;
        });

        $window.addEventListener("IFrameShowEventProxy", function() {
            // activate from iframe#Content
            $scope.searchInputVisible = true;
        });

        $window.addEventListener("searchBoxHideEvent", function() {
            // activate from iframe#Content
            $scope.searchInputVisible = false;
        });
});
