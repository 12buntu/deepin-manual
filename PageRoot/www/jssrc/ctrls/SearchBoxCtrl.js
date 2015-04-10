"use strict";

angular.module("DManual")
       .controller("SearchBoxCtrl", function($scope, $rootScope, $animate, $timeout, $log, $window) {
            $scope.headers = [];
            $scope.searchBoxVisible = false;
            let timer = null;
            let inactiveTimerStart = function() {
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    $scope.searchBoxVisible = false;
                }, 3000);
            };

            $scope.doSearch = function($innerScope, $event){
                if ($event.keyCode == 13) {
                    $rootScope.$broadcast("searchTermChanged", $scope.searchTerm);
                    return true;
                }
                inactiveTimerStart();
                return false;
            }

            $scope.$on("showSearchBox", function(){
                $log.log("Search");
                $scope.searchBoxVisible = true;
                inactiveTimerStart();
                document.querySelector("#SearchInput").focus();
            });

            $scope.showSearch = function(){
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    $scope.searchBoxVisible = true;
                    inactiveTimerStart();
                }, 1500);
            }
            $scope.hideSearch = function(){
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    $scope.searchBoxVisible = false;
                }, 1500);
            }

            $window.addEventListener("IFrameShowEventProxy", function() {
                $log.log("proxy..");
                $scope.$emit("showSearchBox");
            });
            // $scope.$watch("searchTerm", function(newValue, oldValue){
            //     $rootScope.$broadcast("searchTermChanged", newValue);
            // });
            $scope.$on("headersSet", function(event, value) {
                $log.log("Headers changed to", value);
                $scope.headers = value;
            });
       });
