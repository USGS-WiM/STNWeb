/**
 * Created by bdraper on 4/7/2016.
 */
(function () {
    'use strict';
    var STNControllers = angular.module('STNControllers');

    STNControllers.controller('MapFiltersController', ['$scope', '$http', '$rootScope', '$cookies', '$location', 'SITE', 'EVENT', 'Map_Filter', '$state',  'stateList', 'sensorTypes', 'networkNames', 'spinnerService',
        function ($scope, $http, $rootScope, $cookies, $location, SITE, EVENT, Map_Filter, $state, stateList, sensorTypes, networkNames, spinnerService) {
            $scope.status = { siteOpen: true }; //accordion for siteInfo

            $scope.states = stateList;
            $scope.senTypes = sensorTypes;
            $scope.netNames = networkNames;
            $scope.Chosen = {
                network: null,
                sensor: null
            };
            $scope.chosenStates = []; //used to join each abbrev to pass to call
            $scope.siteResponse = false;
            $scope.checkboxModel = {
                eventSitesOnly: '1',
                hwmOnly: '0',
                senOnly: '0',
                rdgOnly: '0',
                opDefined: '0'
            };

            $scope.searchSites = function () {
                //$rootScope.stateIsLoading.showLoading = true; // loading..
                //store search in case they leave and click back
                spinnerService.show("mapSpinner");

                if ($scope.checkboxModel.eventSitesOnly === "1" && $scope.sessionEventExists == true ) {
                    var stateString = $scope.chosenStates.join();
                    $scope.siteResponse = false;
                    $scope.siteList = [];
                    var evID = $cookies.get('SessionEventID') !== null && $cookies.get('SessionEventID') !== undefined ? $cookies.get('SessionEventID') : 0;
                    $rootScope.searchParams = {
                        event: evID,
                        state: $scope.chosenStates,
                        SensorType: $scope.Chosen.sensor,
                        NetworkName: $scope.Chosen.network,
                        HWMOnly: $scope.checkboxModel.hwmOnly,
                        SensorOnly: $scope.checkboxModel.senOnly,
                        RDGOnly: $scope.checkboxModel.rdgOnly,
                        OPDefined: $scope.checkboxModel.opDefined
                    };
                    SITE.getFilteredSites({
                            Event: evID,
                            State: stateString,
                            SensorType: $scope.Chosen.sensor,
                            NetworkName: $scope.Chosen.network,
                            HWMOnly: $scope.checkboxModel.hwmOnly,
                            SensorOnly: $scope.checkboxModel.senOnly,
                            RDGOnly: $scope.checkboxModel.rdgOnly,
                            OPDefined: $scope.checkboxModel.opDefined
                        },
                        function success(response) {
                            // $scope.siteList = response;
                            // $scope.siteResponse = true;
                            spinnerService.hide("mapSpinner");
                            //$rootScope.stateIsLoading.showLoading = false; // loading..
                            Map_Filter.setFilteredSites(response);

                        }, function error(errorResponse) {
                            $rootScope.stateIsLoading.showLoading = false; // loading..
                            alert("Error: " + errorResponse.statusText);
                        });
                } else if ($scope.checkboxModel.eventSitesOnly === "0" || $scope.sessionEventExists == false){


                    var stateString = $scope.chosenStates.join();
                    $scope.siteResponse = false;
                    $scope.siteList = [];

                    $rootScope.searchParams = {
                        state: $scope.chosenStates,
                        SensorType: $scope.Chosen.sensor,
                        NetworkName: $scope.Chosen.network,
                        HWMOnly: $scope.checkboxModel.hwmOnly,
                        SensorOnly: $scope.checkboxModel.senOnly,
                        RDGOnly: $scope.checkboxModel.rdgOnly,
                        OPDefined: $scope.checkboxModel.opDefined
                    };

                    var sp = $rootScope.searchParams;
                    if (sp.HWMOnly === "0" && sp.NetworkName == null && sp.OPDefined === "0" && sp.RDGOnly === "0" && sp.SensorOnly === "0" && sp.SensorType === null && sp.state.length == 0) {
                        spinnerService.hide("mapSpinner");
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.warning("Please select at least one search parameter.", "Map Filters");
                        return;
                    }

                    SITE.getFilteredSites({
                            State: stateString,
                            SensorType: $scope.Chosen.sensor,
                            NetworkName: $scope.Chosen.network,
                            HWMOnly: $scope.checkboxModel.hwmOnly,
                            SensorOnly: $scope.checkboxModel.senOnly,
                            RDGOnly: $scope.checkboxModel.rdgOnly,
                            OPDefined: $scope.checkboxModel.opDefined
                        },
                        function success(response) {
                            // $scope.siteList = response;
                            // $scope.siteResponse = true;
                            spinnerService.hide("mapSpinner");
                            //$rootScope.stateIsLoading.showLoading = false; // loading..
                            Map_Filter.setFilteredSites(response);

                        }, function error(errorResponse) {
                            $rootScope.stateIsLoading.showLoading = false; // loading..
                            alert("Error: " + errorResponse.statusText);
                        });


                }
            };//end searchSites click action

            //add each state to an array to be joined in the GET
            $scope.stateClick = function (data) {
                if (data.selected === true) {
                    $scope.chosenStates.push(data.state_abbrev);
                }
                if (data.selected === false) {
                    var ind = $scope.chosenStates.indexOf(data.state_abbrev);
                    if (ind >= 0) {
                        $scope.chosenStates.splice(ind, 1);
                    }
                }
            };

            //clear the filter choices (start over)
            $scope.clearFilters = function () {
                spinnerService.show("mapSpinner");
                $scope.checkboxModel = {
                    eventSitesOnly: 1,
                    hwmOnly: 0,
                    senOnly: 0,
                    rdgOnly: 0,
                    opDefined: 0
                };
                $scope.Chosen = {};
                $scope.chosenStates = [];
                angular.forEach($scope.states, function (st) {
                    st.selected = false;
                });
                var evID = $cookies.get('SessionEventID') !== null && $cookies.get('SessionEventID') !== undefined ? $cookies.get('SessionEventID') : 0;
                $scope.sitesPromise = EVENT.getEventSites({id: evID},//SITE.getAll({ Event: evID },
                function success(response) {
                    //spinnerService.hide("mapSpinner");
                    Map_Filter.setFilteredSites(response);
                    spinnerService.hide("mapSpinner");
                }, function error(errorResponse) {

                });
            };

            // $rootScope.$on('mapSiteClick', function (event, siteParts) {
            //     $scope.aSite = siteParts[0];
            //     //only 6 decimal places for lat/long
            //     $scope.aSite.latitude_dd = parseFloat($scope.aSite.latitude_dd.toFixed(6));
            //     $scope.aSite.longitude_dd = parseFloat($scope.aSite.longitude_dd.toFixed(6));
            // });

        }]);//end controller function
})();
