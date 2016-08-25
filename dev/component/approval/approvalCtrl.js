
(function () {
    /* controllers.js, 'leaflet-directive''ui.unique','ngTagsInput',*/
    'use strict';

    var STNControllers = angular.module('STNControllers');

    STNControllers.controller('approvalCtrl', ['$scope', '$cookies', '$rootScope', '$location', '$http', 'stateList', 'instrumentList', 'allSensorTypes', 'allDepTypes', 'HWM', 'DATA_FILE', 'INSTRUMENT', 'MEMBER', 'SITE',
        function ($scope, $cookies, $rootScope, $location, $http, stateList, instrumentList, allSensorTypes, allDepTypes, HWM, DATA_FILE, INSTRUMENT, MEMBER, SITE) {
            if ($cookies.get('STNCreds') === undefined || $cookies.get('STNCreds') === "") {
                $scope.auth = false;
                $location.path('/login');
            } else {
                //TODO: Who can do approvals????????
                $rootScope.thisPage = "Approval";
                $rootScope.activeMenu = "approval";
                
                // watch for the session event to change and update  
                $scope.$watch(function () { return $cookies.get('SessionEventName'); }, function (newValue) {
                    $scope.sessionEvent = $cookies.get('SessionEventName') !== null && $cookies.get('SessionEventName') !== undefined ? $cookies.get('SessionEventName') : "All Events";
                });

                $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('STNCreds');
                $http.defaults.headers.common.Accept = 'application/json';
                MEMBER.getAll(function success(response) { $scope.allMembers = response;}).$promise;

                $scope.allStates = stateList;
                $scope.allInstruments = instrumentList;
                $scope.allSensorTypes = allSensorTypes;
                $scope.allDeploymentTypes = allDepTypes;
                $scope.ChosenEvent = {};
                $scope.ChosenState = {};
                $scope.ChosenMember = {};
                $scope.unApprovedHWMs = []; $scope.showHWMbox = false;
                $scope.unApprovedDFs = []; $scope.showDFbox = false;

                //if they are coming back here, see if a search has been stored last time.
                if ($rootScope.approvalSearch !== undefined) {
                    var thisSearch = $rootScope.approvalSearch;
                    $scope.sessionEvent = Number(thisSearch.eventID);
                    $scope.ChosenState.id = thisSearch.stateID;
                    $scope.ChosenMember.id = thisSearch.memberID;                    
                    //go get the HWMs and DataFiles that need to be approved
                    $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('STNCreds');
                    $http.defaults.headers.common.Accept = 'application/json';
                    HWM.getUnapprovedHWMs({ IsApproved: 'false', Event: thisSearch.eventID, Member: thisSearch.memberID, State: thisSearch.stateID }, function success(response) {
                        $scope.unApprovedHWMs = response;
                        $scope.showHWMbox = true;

                    }, function error(errorResponse) {
                        alert("Error: " + errorResponse.statusText);
                    });
                    DATA_FILE.getUnapprovedDFs({ IsApproved: 'false', Event: thisSearch.eventID, Processor: thisSearch.memberID, State: thisSearch.stateID }, function success(response1) {
                        var DFs = response1;
                        //need sensor and site info
                        angular.forEach(DFs, function (df) {
                            var thisdfInst = $scope.allInstruments.filter(function (i) { return i.instrument_id == df.instrument_id; })[0];
                            var formattedDF = {};
                            var siteID = thisdfInst.site_id;
                            formattedDF.SiteId = siteID;
                            formattedDF.senType = $scope.allSensorTypes.filter(function (s) { return s.sensor_type_id == thisdfInst.sensor_type_id; })[0].sensor;
                            var depType = $scope.allDeploymentTypes.filter(function (d) { return d.deployment_type_id == thisdfInst.deployment_type_id; })[0];
                            formattedDF.depType = depType !== undefined ? depType.method : undefined;
                            formattedDF.InstrID = thisdfInst.instrument_id;
                            SITE.query({ id: siteID }).$promise.then(function (response2) {
                                formattedDF.SiteNo = response2.site_no;
                                
                                $scope.unApprovedDFs.push(formattedDF);
                            });
                        });
                        $scope.showDFbox = true;
                    }, function error(errorResponse1) {
                        alert("Error: " + errorResponse1.statusText);
                    });
                }
                $scope.search = function () {
                    //clear contents in case they are searching multiple times
                    $scope.unApprovedHWMs = []; $scope.showHWMbox = false;
                    $scope.unApprovedDFs = []; $scope.showDFbox = false;
                    var evID = $cookies.get('SessionEventID') !== null && $cookies.get('SessionEventID') !== undefined ? $cookies.get('SessionEventID') : 0;
                    var sID = $scope.ChosenState.id !== undefined ? $scope.ChosenState.id : 0;
                    var mID = $scope.ChosenMember.id !== undefined ? $scope.ChosenMember.id : 0;
                    $rootScope.approvalSearch = {
                        eventID: evID,
                        stateID: sID,
                        memberID: mID
                    };
                    //go get the HWMs and DataFiles that need to be approved
                    $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('STNCreds');
                    $http.defaults.headers.common.Accept = 'application/json';
                    HWM.getUnapprovedHWMs({ IsApproved: 'false', Event: evID, Member: mID, State: sID }, function success(response) {
                        //need site no
                        angular.forEach(response, function (h) {
                            SITE.query({ id: h.site_id }).$promise.then(function (sresponse) {
                                h.site_no = sresponse.site_no;
                                $scope.unApprovedHWMs.push(h);
                            });
                        });
                        $scope.showHWMbox = true;

                    }, function error(errorResponse) {
                        alert("Error: " + errorResponse.statusText);
                    });
                    DATA_FILE.getUnapprovedDFs({ IsApproved: 'false', Event: evID, Processor: mID, State: sID }, function success(response1) {
                        var DFs = response1;
                        //need sensor and site info
                        angular.forEach(DFs, function (df) {
                            var thisdfInst = $scope.allInstruments.filter(function (i) { return i.instrument_id == df.instrument_id; })[0];
                            var formattedDF = {};
                            var siteID = thisdfInst.site_id;
                            formattedDF.SiteId = siteID;
                            formattedDF.senType = $scope.allSensorTypes.filter(function (s) { return s.sensor_type_id == thisdfInst.sensor_type_id; })[0].sensor;
                            var depType = $scope.allDeploymentTypes.filter(function (d) { return d.deployment_type_id == thisdfInst.deployment_type_id; })[0];
                            formattedDF.depType = depType !== undefined ? depType.method : undefined;
                            formattedDF.InstrID = thisdfInst.instrument_id;
                            SITE.query({ id: siteID }).$promise.then(function (response2) {
                                formattedDF.SiteNo = response2.site_no;
                                
                                $scope.unApprovedDFs.push(formattedDF);
                            });
                        });
                        $scope.showDFbox = true;
                    }, function error(errorResponse1) {
                        alert("Error: " + errorResponse1.statusText);
                    });
                };
            }
        }]);

})();