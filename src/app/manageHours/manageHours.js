angular
  .module("manage.manageHours", [])
  .constant("HOURS_FROM", [
    { name: "By appointment", value: "-3" },
    { name: "TBA", value: "-2" },
    { name: "Closed 24hrs", value: "-1" },
    { name: "Midnight", value: "0" },
    { name: "6:00 am", value: "600" },
    { name: "7:00 am", value: "700" },
    { name: "7:30 am", value: "730" },
    { name: "7:45 am", value: "745" },
    { name: "8:00 am", value: "800" },
    { name: "9:00 am", value: "900" },
    { name: "10:00 am", value: "1000" },
    { name: "11:00 am", value: "1100" },
    { name: "Noon", value: "1200" },
    { name: "1:00 pm", value: "1300" },
    { name: "2:00 pm", value: "1400" },
    { name: "2:30 pm", value: "1430" },
    { name: "3:00 pm", value: "1500" },
    { name: "6:00 pm", value: "1800" },
  ])
  .constant("HOURS_TO", [
    { name: "1:00 am", value: "100" },
    { name: "2:00 am", value: "200" },
    { name: "3:00 am", value: "300" },
    { name: "8:00 am", value: "800" },
    { name: "9:00 am", value: "900" },
    { name: "10:00 am", value: "1000" },
    { name: "11:00 am", value: "1100" },
    { name: "Noon", value: "1200" },
    { name: "1:00 pm", value: "1300" },
    { name: "2:00 pm", value: "1400" },
    { name: "3:00 pm", value: "1500" },
    { name: "4:00 pm", value: "1600" },
    { name: "4:30 pm", value: "1630" },
    { name: "4:45 pm", value: "1645" },
    { name: "5:00 pm", value: "1700" },
    { name: "5:30 pm", value: "1730" },
    { name: "6:00 pm", value: "1800" },
    { name: "6:30 pm", value: "1830" },
    { name: "7:00 pm", value: "1900" },
    { name: "8:00 pm", value: "2000" },
    { name: "9:00 pm", value: "2100" },
    { name: "10:00 pm", value: "2200" },
    { name: "10:30 pm", value: "2230" },
    { name: "11:00 pm", value: "2300" },
    { name: "Midnight", value: "2400" },
  ])
  .constant("DP_FORMAT", "MM/dd/yyyy")
  .constant("HOURS_GROUP", 2)

  .config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/manage-hours", {
        controller: "manageHrsCtrl",
        templateUrl: "manageHours/manageHours.tpl.html",
        resolve: {
          userData: function (tokenReceiver) {
            return tokenReceiver.getPromise();
          },
        },
      });
    },
  ])

  .controller("manageHrsCtrl", [
    "$scope",
    "$animate",
    "hmFactory",
    "HOURS_FROM",
    "HOURS_TO",
    "DP_FORMAT",
    "userData",
    "HOURS_GROUP",
    "AuthService",
    function manageHrsCtrl(
      $scope,
      $animate,
      hmFactory,
      hoursFrom,
      hoursTo,
      dpFormat,
      userData,
      HOURS_GROUP,
      AuthService
    ) {
      $scope.userInfo = AuthService.isAuthorized();
      $scope.allowedLibraries = [];
      $scope.format = dpFormat;
      $scope.hrsFrom = hoursFrom;
      $scope.hrsTo = hoursTo;
      $scope.selLib = {};
      $scope.hasAccess = false;
      if (angular.isDefined($scope.userInfo.group)) {
        if ((parseInt($scope.userInfo.group) & HOURS_GROUP) === HOURS_GROUP) {
          $scope.hasAccess = true;
        }
      }

      $scope.initSemesters = function (semesters) {
        for (var sem = 0; sem < semesters.length; sem++) {
          semesters[sem].startdate = new Date(semesters[sem].startdate);
          semesters[sem].startdate.setTime(
            semesters[sem].startdate.getTime() +
              semesters[sem].startdate.getTimezoneOffset() * 60 * 1000
          );
          semesters[sem].enddate = new Date(semesters[sem].enddate);
          semesters[sem].enddate.setTime(
            semesters[sem].enddate.getTime() +
              semesters[sem].enddate.getTimezoneOffset() * 60 * 1000
          );
          semesters[sem].dp = false;
        }
        return semesters;
      };

      hmFactory
        .getData("semesters")
        .success(function (data) {
          console.dir(data);
          $scope.selLib = data.libraries[0];
          for (var lib = 0; lib < data.libraries.length; lib++) {
            for (var ex = 0; ex < data.exc[lib].length; ex++) {
              data.exc[lib][ex].datems = new Date(
                data.exc[lib][ex].date * 1000
              );
              data.exc[lib][ex].dp = false;
            }
            data.sem[lib] = $scope.initSemesters(data.sem[lib]);
          }
          $scope.allowedLibraries = data;
        })
        .error(function (data, status, headers, config) {
          console.log(data);
        });

      $scope.tabs = [
        { name: "Semesters", number: 0, active: true },
        { name: "Exceptions", number: 1, active: false },
      ];
    },
  ])

  .controller("semListCtrl", [
    "$scope",
    "hmFactory",
    function semListCtrl($scope, hmFactory) {
      $scope.expSem = -1;
      $scope.weekHrs = [];
      $scope.loading = false;
      $scope.newSemester = {};
      $scope.newSemester.dp = false;
      $scope.newSemester.dow = [];
      $scope.newSemester.name = "";
      $scope.newSemester.startdate = new Date();
      $scope.newSemester.startdate.setHours(0, 0, 0, 0);

      for (var day = 0; day < 7; day++) {
        $scope.newSemester.dow[day] = {};
        $scope.newSemester.dow[day].from = -1;
        $scope.newSemester.dow[day].to = 0;
      }

      $scope.onSemFocus = function ($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        if (typeof index != "undefined" && index >= 0)
          $scope.allowedLibraries.sem[$scope.selLib.index][index].dp = true;
        else $scope.newSemester.dp = true;
      };

      $scope.expandSem = function ($event, semester) {
        if ($scope.expSem !== semester.dsid) {
          $scope.result = "";
          $scope.resultDel = "";
          for (var i = 0; i < 7; i++) {
            var len = $scope.hrsFrom.length;
            $scope.weekHrs[i] = {};
            $scope.weekHrs[i].from = $scope.hrsFrom[0];
            $scope.weekHrs[i].to = $scope.hrsTo[0];
            for (var j = 0; j < len; j++) {
              if ($scope.hrsFrom[j].value == semester.dow[i].from) {
                $scope.weekHrs[i].from = $scope.hrsFrom[j];
              }
              if ($scope.hrsTo[j].value == semester.dow[i].to) {
                $scope.weekHrs[i].to = $scope.hrsTo[j];
              }
            }
          }
        } else {
          $event.preventDefault();
          $event.stopPropagation();
        }
        $scope.expSem = semester.dsid;
      };
      $scope.isExpSem = function (semID) {
        if ($scope.expSem === semID) return true;
        return false;
      };

      $scope.saveChanges = function (semester) {
        semester.lid = $scope.selLib.lid;
        semester.libName = $scope.selLib.name;
        $scope.loading = true;
        hmFactory
          .postData({ action: 1 }, semester)
          .success(function (data) {
            if (typeof data === "object" && data !== null) {
              $scope.result = "Semester updated";
              $scope.allowedLibraries.sem[
                $scope.selLib.index
              ] = $scope.initSemesters(data);
            } else $scope.result = "Error! Could not save data!";
            $scope.loading = false;
          })
          .error(function (data, status, headers, config) {
            $scope.loading = false;
          });
      };
      $scope.deleteSem = function (semester, index) {
        if (
          confirm(
            "Are you sure you want to delete " + semester.name + " semester?"
          )
        ) {
          $scope.loading = true;
          semester.lid = $scope.selLib.lid;
          semester.libName = $scope.selLib.name;
          hmFactory
            .postData({ action: 3 }, semester)
            .success(function (data) {
              if (typeof data === "object" && data !== null) {
                $scope.result = "Semester deleted";
                $scope.allowedLibraries.sem[
                  $scope.selLib.index
                ] = $scope.initSemesters(data);
              } else $scope.result = "Error! Could not delete semester!";
              $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
              $scope.loading = false;
            });
        }
      };
      $scope.createSem = function () {
        $scope.loading = true;
        $scope.newSemester.lid = $scope.selLib.lid;
        $scope.newSemester.libName = $scope.selLib.name;
        hmFactory
          .postData({ action: 2 }, $scope.newSemester)
          .success(function (data) {
            if (typeof data === "object" && data !== null) {
              $scope.result = "Semester created";
              $scope.allowedLibraries.sem[
                $scope.selLib.index
              ] = $scope.initSemesters(data);
            } else $scope.result = "Error! Could not create semester!";
            $scope.loading = false;
          })
          .error(function (data, status, headers, config) {
            $scope.loading = false;
          });
      };
    },
  ])

  .directive("semesterList", [
    function () {
      return {
        restrict: "A",
        controller: "semListCtrl",
        templateUrl: "manageHours/manageSem.tpl.html",
      };
    },
  ])

  .controller("exListCtrl", [
    "$scope",
    "hmFactory",
    function exListCtrl($scope, hmFactory) {
      $scope.newException = {};
      $scope.newException.from = -1;
      $scope.newException.to = 0;
      $scope.newException.dp = false;
      $scope.newException.isGlobal = false;
      $scope.newException.desc = "";
      $scope.newException.days = 1;
      $scope.newException.datems = new Date();
      $scope.newException.datems.setHours(0, 0, 0, 0);
      $scope.expExc = -1;

      $scope.onExcFocus = function ($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        if (typeof index != "undefined" && index >= 0)
          $scope.allowedLibraries.exc[$scope.selLib.index][index].dp = true;
        else $scope.newException.dp = true;
      };
      $scope.expandExc = function ($event, exception) {
        if ($scope.expExc != exception.id) {
          $scope.result = "";
          $scope.resultDel = "";
        } else {
          $event.preventDefault();
          $event.stopPropagation();
        }
        $scope.expExc = exception.id;
      };
      $scope.isExpExc = function (excID) {
        if ($scope.expExc === excID) return true;
        return false;
      };
      $scope.updateExc = function (exception) {
        $scope.loading = true;
        exception.lid = $scope.selLib.lid;
        exception.datems2 = exception.datems.valueOf() / 1000;
        hmFactory
          .postData({ action: 4 }, exception)
          .success(function (data) {
            if (data == 1) {
              $scope.result = "Saved";
            } else $scope.result = "Error! Could not update exception!";
            $scope.loading = false;
          })
          .error(function (data, status, headers, config) {
            $scope.loading = false;
          });
      };

      $scope.deleteExc = function (exception, index) {
        if (
          confirm(
            "Are you sure you want to delete " + exception.desc + " exception?"
          )
        ) {
          $scope.loading = true;
          exception.lid = $scope.selLib.lid;
          hmFactory
            .postData({ action: 5 }, exception)
            .success(function (data) {
              if (data == 1) {
                $scope.allowedLibraries.exc[$scope.selLib.index].splice(
                  index,
                  1
                );
                $scope.expExc = -1;
              } else $scope.result = "Error! Could not delete exception!";
              $scope.loading = false;
            })
            .error(function (data, status, headers, config) {
              $scope.loading = false;
            });
        }
      };

      $scope.createExc = function () {
        $scope.loading = true;
        $scope.newException.lid = $scope.selLib.lid;
        $scope.newException.datems2 =
          $scope.newException.datems.valueOf() / 1000;
        hmFactory
          .postData({ action: 6 }, $scope.newException)
          .success(function (data) {
            if (typeof data === "object" && data !== null) {
              var i = 0;
              for (i = 0; i < data.length; i++) {
                var newExc = {};
                newExc.id = data[i].id;
                newExc.datems = new Date($scope.newException.datems2 * 1000);
                newExc.days = $scope.newException.days;
                newExc.desc = $scope.newException.desc;
                newExc.from = $scope.newException.from;
                newExc.to = $scope.newException.to;
                newExc.dp = false;
                var l = 0;
                for (l = 0; l < $scope.allowedLibraries.libraries.length; l++)
                  if ($scope.allowedLibraries.libraries[l].lid === data[i].lid)
                    break;
                $scope.allowedLibraries.exc[
                  $scope.allowedLibraries.libraries[l].index
                ].push(newExc);
              }
              $scope.result = "Created exceptions count: " + i;
            } else $scope.result = "Error! Could not create an exception!";
            $scope.loading = false;
            console.log(data);
          })
          .error(function (data, status, headers, config) {
            $scope.loading = false;
          });
      };

      $scope.deleteOldExc = function () {
        $scope.loading = true;
        hmFactory
          .postData({ action: 7 }, $scope.selLib)
          .success(function (data) {
            if (typeof data === "object" && data !== null) {
              $scope.expExc = -1;
              for (var ex = 0; ex < data.length; ex++) {
                data[ex].datems = new Date(data[ex].date * 1000);
                data[ex].dp = false;
              }
              $scope.allowedLibraries.exc[$scope.selLib.index] = data;
              $scope.resultDel = "Outdated exceptions deleted";
            } else $scope.resultDel = "Error! Could not delete exceptions!";
            $scope.loading = false;
          })
          .error(function (data, status, headers, config) {
            $scope.loading = false;
          });
      };
    },
  ])
  .directive("exceptionList", [
    function () {
      return {
        restrict: "A",
        controller: "exListCtrl",
        link: function (scope, elem, attrs) {},
        templateUrl: "manageHours/manageEx.tpl.html",
      };
    },
  ]);
