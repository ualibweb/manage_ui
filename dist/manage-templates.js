angular.module('manage.templates', ['manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'siteFeedback/siteFeedback.tpl.html', 'staffDirectory/staffDirectory.tpl.html']);

angular.module("manageHours/manageEx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageEx.tpl.html",
    "<div class=\"text-right\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
    "    <br>{{resultDel}}\n" +
    "</div>\n" +
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Exception Description</th>\n" +
    "        <th class=\"text-center\">Date</th>\n" +
    "        <th class=\"text-center\">Days</th>\n" +
    "        <th class=\"text-center\">Hours</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"exception in allowedLibraries.exc[selLib].ex track by exception.id\" ng-click=\"expandExc($event, exception)\">\n" +
    "        <td style=\"width:30%\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.desc}}</div>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.desc\" ng-required /></div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.datems | date : 'MMM d, y'}}</div>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\">\n" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                       ng-model=\"exception.datems\" is-open=\"exception.dp\"\n" +
    "                       ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExcFocus($event, $index)\" />\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.days}}</div>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.days\" ng-required /></div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"exception.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{exception.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"exception.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{exception.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updateExc(exception)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Save</button>\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteExc(exception, $index)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Delete</button>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\"><br>{{result}}</div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"newException.desc\" placeholder=\"Exception Description\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" show-button-bar=\"false\"\n" +
    "                   ng-model=\"newException.datems\" is-open=\"newException.dp\" close-text=\"Close\"\n" +
    "                   ng-required=\"true\" placeholder=\"MM/DD/YYYY\" ng-focus=\"onExcFocus($event)\" />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"newException.days\" placeholder=\"Days\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"newException.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{newException.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"newException.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{newException.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createExc()\" ng-disabled=\"loading\">Create Exception</button>\n" +
    "            <br>{{result}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageHours.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHours.tpl.html",
    "<h2><a href=\"../\">Hours</a> Management\n" +
    "\n" +
    "    <select class=\"form-control\" ng-model=\"selLib\">\n" +
    "        <option ng-repeat=\"lib in allowedLibraries.sem\" ng-value=\"$index\" ng-selected=\"selLib == $index\">{{lib.library.name}}</option>\n" +
    "    </select>\n" +
    "\n" +
    "</h2>\n" +
    "<h2 class=\"text-center\">{{allowedLibraries.sem[selLib].library.name}}</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-show=\"tab.number == 0\">\n" +
    "            <div semester-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"tab.number == 1\" >\n" +
    "            <div exception-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageHours/manageLoc.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageLoc.tpl.html",
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Library Name</th>\n" +
    "        <th class=\"text-center\">ID</th>\n" +
    "        <th class=\"text-center\">Parent ID</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"lib in dataUL.locations\" ng-click=\"expandLoc(lib)\">\n" +
    "        <td>\n" +
    "            {{lib.name}}\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            {{lib.lid}}\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            {{lib.parent}}\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updateExc(exception)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"isLoading\">Save</button>\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteExc(exception, $index)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"isLoading\">Delete</button>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\"><br>{{result}}</div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            <input type=\"text\" class=\"form-control\" size=\"30\" ng-model=\"newLocation\" placeholder=\"Library Name\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <select class=\"form-control\" ng-model=\"newParent\" ng-options=\"lib.name for lib in dataUL.locations\">\n" +
    "                <option value=\"\" selected>Select parent library</option>\n" +
    "            </select>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createLoc(newLocation, newParent)\" ng-disabled=\"isLoading\">Create Location</button>\n" +
    "            <br>{{result2}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageSem.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageSem.tpl.html",
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Semester</th>\n" +
    "        <th class=\"text-center\">Sun</th>\n" +
    "        <th class=\"text-center\">Mon</th>\n" +
    "        <th class=\"text-center\">Tue</th>\n" +
    "        <th class=\"text-center\">Wed</th>\n" +
    "        <th class=\"text-center\">Thu</th>\n" +
    "        <th class=\"text-center\">Fri</th>\n" +
    "        <th class=\"text-center\">Sat</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"sem in allowedLibraries.sem[selLib].sem\" ng-click=\"expandSem($event, sem)\">\n" +
    "        <th scope=\"row\" ng-hide=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            {{sem.startdate | date : 'MMM d, y'}}<br>{{sem.enddate}}\n" +
    "        </th>\n" +
    "        <th scope=\"row\" ng-show=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" size=\"3\"\n" +
    "                       ng-model=\"sem.startdate\" is-open=\"sem.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onSemFocus($event, $index)\" />\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">Save</button>\n" +
    "                {{result}}\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteSem(sem)\" ng-disabled=\"loading\">Delete {{sem.name}}</button>\n" +
    "            </div>\n" +
    "        </th>\n" +
    "        <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in sem.dow\">\n" +
    "            <div ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                {{day.hours}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"isExpSem(sem.dsid)\">\n" +
    "                <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                    <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                </select>\n" +
    "                <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                    <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Semester</th>\n" +
    "        <th class=\"text-center\">Sun</th>\n" +
    "        <th class=\"text-center\">Mon</th>\n" +
    "        <th class=\"text-center\">Tue</th>\n" +
    "        <th class=\"text-center\">Wed</th>\n" +
    "        <th class=\"text-center\">Thu</th>\n" +
    "        <th class=\"text-center\">Fri</th>\n" +
    "        <th class=\"text-center\">Sat</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-minlength=\"4\" ng-maxlength=\"32\" ng-model=\"newSemester.name\" placeholder=\"Semester Name\" ng-required /><br>\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                       ng-model=\"newSemester.startdate\" is-open=\"newSemester.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onSemFocus($event)\" />\n" +
    "            </div>\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createSem()\" ng-disabled=\"loading\">Create New Semester</button>\n" +
    "            {{result}}\n" +
    "        </th>\n" +
    "        <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in newSemester.dow\">\n" +
    "            <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "            </select>\n" +
    "            <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "            </select>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageUsers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageUsers.tpl.html",
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>User Login</th>\n" +
    "        <th class=\"text-center\">Access to This Page</th>\n" +
    "        <th class=\"text-center\">Library Access</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"user in dataUL.users\" ng-click=\"expandUser(user)\">\n" +
    "        <th scope=\"row\">{{user.name}}\n" +
    "        </th>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"checkbox\" ng-model=\"user.role\">\n" +
    "        </td>\n" +
    "        <td class=\"text-left\">\n" +
    "            <div class=\"row\" ng-repeat=\"lib in dataUL.locations\">\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"user.access[$index]\" ng-show=\"isExpUser(user.uid)\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <div ng-show=\"isExpUser(user.uid) || user.access[$index]\">{{lib.name}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-show=\"isExpUser(user.uid)\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                        ng-hide=\"expUserIndex == 0\">Save</button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
    "                        ng-hide=\"expUserIndex == 0\">Delete</button><br>\n" +
    "                {{result}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.name for user in users\">\n" +
    "            </select>\n" +
    "        </th>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"checkbox\" ng-model=\"newUserAdmin\">\n" +
    "        </td>\n" +
    "        <td class=\"text-left\">\n" +
    "            <div class=\"row\" ng-repeat=\"lib in dataUL.locations\">\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    {{lib.name}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">Grant Access</button><br>\n" +
    "                {{result2}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageOneSearch/manageOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/manageOneSearch.tpl.html",
    "<h3>OneSearch Recommended Links Management</h3>\n" +
    "\n" +
    "<form class=\"form-inline\" ng-submit=\"addRecommendation()\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" size=\"30\" maxlength=\"200\" ng-model=\"addRec.keyword\" required>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" size=\"30\" maxlength=\"1024\" ng-model=\"addRec.link\" required>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" size=\"30\" maxlength=\"100\" ng-model=\"addRec.title\" required>\n" +
    "        <button type=\"submit\" class=\"btn btn-primary\">Add Recommended Link</button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "<div ng-show=\"response.length > 0\">\n" +
    "    {{response}}\n" +
    "</div>\n" +
    "<h4>Full list</h4>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\" ng-repeat=\"rec in recList.RecList\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteRec(rec, $index)\">Delete</button>\n" +
    "        <span>{{rec.keyword}} = <a href=\"{{rec.link}}\">{{rec.description}}</a></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageUserGroups/manageUG.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/manageUG.tpl.html",
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-show=\"tab.number == 0\">\n" +
    "            <table class=\"table table-hover table-condensed\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>User Login</th>\n" +
    "                    <th class=\"text-center\">Name</th>\n" +
    "                    <th class=\"text-center\">Access Rights to Web Applications</th>\n" +
    "                    <th class=\"text-center\">Action</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tr ng-repeat=\"user in users\" ng-click=\"expandUser(user)\">\n" +
    "                    <th scope=\"row\">\n" +
    "                        {{user.wpLogin}}\n" +
    "                    </th>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        {{user.name}}\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div ng-show=\"isExpUser(user.id) && $index > 0\">\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-xs-4 text-right\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"user.access[$index]\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-8\">\n" +
    "                                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-hide=\"isExpUser(user.id) && $index > 0\">\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-xs-4 text-right\">\n" +
    "\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-8\">\n" +
    "                                    <div ng-show=\"user.access[$index]\">\n" +
    "                                        <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div ng-show=\"isExpUser(user.id)\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                                    ng-show=\"$index > 0\">Save</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
    "                                    ng-show=\"$index > 0\">Remove</button><br>\n" +
    "                            {{result}}\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <th scope=\"row\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.name for user in wpUsers\">\n" +
    "                        </select>\n" +
    "                    </th>\n" +
    "                    <td class=\"text-center\">\n" +
    "\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                            <div class=\"col-xs-4 text-right\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-8\">\n" +
    "                                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div>\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">Grant Access Rights</button><br>\n" +
    "                            {{result2}}\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"tab.number == 1\">\n" +
    "            <h4>Web applications with data manageable by users:</h4>\n" +
    "            <h4 class=\"text-center\" ng-repeat=\"app in apps\" ng-show=\"$index > 0\">\n" +
    "                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "            </h4>\n" +
    "            <p>When we create new web application it has to be added to the database manually.</p>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("siteFeedback/siteFeedback.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("siteFeedback/siteFeedback.tpl.html",
    "<h3>Received Feedback</h3>\n" +
    "<div class=\"row\" ng-repeat=\"record in responses\">\n" +
    "    <h4><a href=\"{{record.pageurl}}\">{{record.pageurl}}</a></h4>\n" +
    "    <div class=\"col-xs-1\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\"\n" +
    "                ng-click=\"delete(record)\"\n" +
    "                ng-show=\"false\">\n" +
    "            Delete\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-1\">\n" +
    "        Score: {{record.score}}\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-2\">\n" +
    "        {{record.when}}\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-2\">\n" +
    "        {{record.ip}}\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\">\n" +
    "        Comments: {{record.comments}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectory.tpl.html",
    "<h2>Library Staff Directory</h2>\n" +
    "\n" +
    "<div ng-show=\"hasAccess\" style=\"background-color:#f9f9f9;\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"firstName\">Firts Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" maxlength=\"25\"\n" +
    "                   ng-model=\"formData.first\" id=\"firstName\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"lastName\">Last Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" maxlength=\"25\"\n" +
    "                   ng-model=\"formData.last\" id=\"lastName\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"email\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Email\" maxlength=\"255\"\n" +
    "                   ng-model=\"formData.email\" id=\"email\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"title\">Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"150\"\n" +
    "                   ng-model=\"formData.title\" id=\"title\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"rank\">Rank</label>\n" +
    "            <select class=\"form-control\" ng-model=\"formData.rank\" ng-options=\"rank for rank in ranks\" id=\"rank\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"dept\">Department</label>\n" +
    "            <select class=\"form-control\" ng-model=\"formData.dept\" ng-options=\"dept for dept in departments\" id=\"dept\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"phone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Phone\" maxlength=\"8\"\n" +
    "                   ng-model=\"formData.phone\" id=\"phone\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"fax\">Fax</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Fax\" maxlength=\"8\" ng-model=\"formData.fax\" id=\"fax\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group text-right\">\n" +
    "            <label for=\"addButton\">&nbsp</label><br>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"addPerson()\" id=\"addButton\">Add New Person</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <p ng-model=\"formResponse\">{{formResponse}}</p>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "    <ul class=\"text-center list-inline\">Sort By:\n" +
    "        <li><button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'first'\" ng-click=\"sortMode='firstname'\">First Name</button></li>\n" +
    "        <li><button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'last'\" ng-click=\"sortMode='lastname'\">Last Name</button></li>\n" +
    "        <li><button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'title'\" ng-click=\"sortMode='title'\">Title</button></li>\n" +
    "        <li><button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'dept'\" ng-click=\"sortMode='department'\">Department</button></li>\n" +
    "        <li><input type=\"text\" placeholder=\"Filter by Last Name\" size=\"25\" maxlength=\"25\" ng-model=\"filterBy\"></li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"person in Directory.list | filter:{lastname:filterBy} | orderBy:sortMode\"\n" +
    "         ng-class=\"{sdOpen: person.show, sdOver: person.id == mOver}\" ng-mouseover=\"setOver(person)\">\n" +
    "        <div class=\"col-md-7\" ng-click=\"togglePerson(person)\">\n" +
    "            <h4>\n" +
    "                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"person.show\"></span>\n" +
    "                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"person.show\"></span>\n" +
    "                {{person.firstname}} {{person.lastname}} <small>{{person.title}}</small>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-5\" ng-click=\"togglePerson(person)\">\n" +
    "            <h4>{{person.department}}</h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"person.show\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <img ng-src=\"{{person.image}}\" style=\"height:250px;\" alt=\"{{person.firstname}} {{person.lastname}}\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\" ng-show=\"person.show && hasAccess == 1\">\n" +
    "                <div class=\"col-md-4 form-group\">\n" +
    "                    <label for=\"{{person.id}}_title\">Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.title}}\" maxlength=\"150\" ng-model=\"person.title\" required\n" +
    "                           id=\"{{person.id}}_title\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{person.id}}_rank\">Rank</label>\n" +
    "                    <select class=\"form-control\" id=\"{{person.id}}_rank\" ng-model=\"person.rank\"\n" +
    "                            ng-options=\"rank for rank in ranks\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{person.id}}_dept\">Department</label>\n" +
    "                    <select class=\"form-control\" id=\"{{person.id}}_dept\" ng-model=\"person.department\"\n" +
    "                            ng-options=\"dept for dept in departments\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_email\">Email</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.email}}\" maxlength=\"1024\" ng-model=\"person.email\" required\n" +
    "                           id=\"{{person.id}}_email\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_phone\">Phone</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.phone}}\" maxlength=\"8\" ng-model=\"person.phone\" required\n" +
    "                           id=\"{{person.id}}_phone\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_fax\">Fax</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.fax}}\" maxlength=\"8\" ng-model=\"person.fax\"\n" +
    "                           id=\"{{person.id}}_fax\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_div\">Division</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.division}}\" maxlength=\"150\" ng-model=\"person.division\"\n" +
    "                           id=\"{{person.id}}_div\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updatePerson(person)\">Update information</button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deletePerson(person, $index)\">\n" +
    "                        Delete {{person.firstname}} {{person.lastname}} record\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h5>LibGuide Subjects</h5>\n" +
    "                    <dd>\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li  ng-repeat=\"subject in person.subjects\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteSubject(person, subject.id, $index)\">\n" +
    "                                    Delete\n" +
    "                                </button>\n" +
    "                                <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"person.selSubj\" ng-options=\"sub.subject for sub in Directory.subjects\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addSubject(person)\">Add Subject</button>\n" +
    "                            <p>{{person.subjResponse}}</p>\n" +
    "                        </form>\n" +
    "                    </dd>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\" ng-show=\"person.show && hasAccess == 0\">\n" +
    "                <dt>Title</dt><dd>{{person.title}}</dd>\n" +
    "                <dt ng-show=\"person.rank.length > 0\">Rank</dt>  <dd>{{person.rank}}</dd>\n" +
    "                <dt>Departent</dt>  <dd>{{person.department}}</dd>\n" +
    "                <dt ng-show=\"person.division.length > 0\">Division</dt>  <dd>{{person.division}}</dd>\n" +
    "                <dt>Email</dt>  <dd>{{person.email}}</dd>\n" +
    "                <dt>Phone</dt>  <dd>{{person.phone}}</dd>\n" +
    "                <dt ng-show=\"person.fax.length > 0\">Fax</dt>  <dd>{{person.fax}}</dd>\n" +
    "                <dt ng-show=\"person.subjects.length > 0\">LibGuide Subjects</dt>\n" +
    "                <dd>\n" +
    "                    <ul class=\"list-inline\">\n" +
    "                        <li ng-repeat=\"subject in person.subjects\">\n" +
    "                            <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </dd>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
