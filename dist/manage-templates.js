angular.module('manage.templates', ['manageDatabases/manageDatabases.tpl.html', 'manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageSoftware/manageSoftware.tpl.html', 'manageSoftware/manageSoftwareList.tpl.html', 'manageSoftware/manageSoftwareLocCat.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'manageUserGroups/viewMyWebApps.tpl.html', 'siteFeedback/siteFeedback.tpl.html', 'staffDirectory/staffDirectory.tpl.html']);

angular.module("manageDatabases/manageDatabases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageDatabases/manageDatabases.tpl.html",
    "<h2>Manage Databases</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredDB.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title starts with\" ng-model=\"titleStartFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subjects contain\" ng-model=\"subjectFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Media Types contain\" ng-model=\"typeFilter\">\n" +
    "                <select class=\"form-control\" ng-model=\"disFilter\" ng-options=\"val.name for val in disValues\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Creation Date\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Last Modified\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"3\" ng-click=\"sortBy(3)\">\n" +
    "                    Temporary Disabled\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[3].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[3].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"db in filteredDB = (DBList.databases | filter:{title:titleStartFilter}:startTitle\n" +
    "                                                         | filter:{title:titleFilter}\n" +
    "                                                         | filter:{description:descrFilter}\n" +
    "                                                         | filter:{subjects:subjectFilter}\n" +
    "                                                         | filter:{types:typeFilter}\n" +
    "                                                         | filter:{disabled:disFilter.value}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: db.show, sdOver: db.id == mOver}\" ng-mouseover=\"setOver(db)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleDB(db)\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                    <a href=\"{{db.url}}\">{{db.title}}</a>\n" +
    "                    <small>{{db.publisher}} <span ng-show=\"db.vendor.length > 0\">: {{db.vendor}}</span></small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 text-right\">\n" +
    "                <h4 ng-show=\"db.tmpDisabled == 1\"><small>TMP</small></h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1\">\n" +
    "                <h4 ng-show=\"db.disabled == 1 || db.tmpDisabled == 1\"><small>DISABLED</small></h4>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"db.show\">\n" +
    "            <form ng-submit=\"updateDB(db)\">\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_title\">Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.title}}\" ng-model=\"db.title\"\n" +
    "                           id=\"{{db.id}}_title\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.publisher}}\" ng-model=\"db.publisher\"\n" +
    "                           id=\"{{db.id}}_Publisher\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.vendor}}\" ng-model=\"db.vendor\"\n" +
    "                           id=\"{{db.id}}_Vendor\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Format\">Format</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.format}}\" ng-model=\"db.format\"\n" +
    "                           id=\"{{db.id}}_Format\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_URL\">URL</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.url}}\" ng-model=\"db.url\"\n" +
    "                           id=\"{{db.id}}_URL\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.location}}\" ng-model=\"db.location\"\n" +
    "                           id=\"{{db.id}}_Location\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_NotInEDS\">Not in EDS</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notInEDS}}\" ng-model=\"db.notInEDS\"\n" +
    "                           id=\"{{db.id}}_NotInEDS\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.hasFullText}}\" ng-model=\"db.hasFullText\"\n" +
    "                           id=\"{{db.id}}_Full-text\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_Authenticate\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.coverage}}\" ng-model=\"db.coverage\"\n" +
    "                           id=\"{{db.id}}_Coverage\" >\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notes}}\" ng-model=\"db.notes\"\n" +
    "                           id=\"{{db.id}}_Notes\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Status\">Status</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.status}}\" ng-model=\"db.status\"\n" +
    "                           id=\"{{db.id}}_Status\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 form-group\">\n" +
    "                    <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                    <textarea class=\"form-control\" rows=\"3\" id=\"{{db.id}}_descr\" ng-model=\"db.description\" ></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_presented\">PresentedBy</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.presentedBy}}\" ng-model=\"db.presentedBy\"\n" +
    "                           id=\"{{db.id}}_presented\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience1\">Audience1</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience1}}\" ng-model=\"db.audience1\"\n" +
    "                           id=\"{{db.id}}_Audience1\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience2\">Audience2</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience2}}\" ng-model=\"db.audience2\"\n" +
    "                           id=\"{{db.id}}_Audience2\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_dAuthor\">Updated by</label>\n" +
    "                    <p id=\"{{db.id}}_dAuthor\">{{db.updatedBy}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_date1\">Date Created</label>\n" +
    "                    <p id=\"{{db.id}}_date1\">{{db.dateCreated}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_date2\">Last Modified</label>\n" +
    "                    <p id=\"{{db.id}}_date2\">{{db.lastModified}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Disable\">Disabled</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.disabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_Disable\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_tmpDisable\">TmpDisable</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.tmpDisabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_tmpDisable\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{db.id}}_subjects\">Subjects</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{db.id}}_subjects\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"subject in db.subjects\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteSubject(db,subject)\">Delete</button>\n" +
    "                                {{subject.subject}} : {{subject.type}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-7\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"db.selSubj\" ng-options=\"sub.subject for sub in DBList.subjects\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"db.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addSubject(db)\">Add Subject</button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{db.id}}_types\">Types</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteType(db,type)\">Delete</button>\n" +
    "                                {{type.type}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item form-inline\">\n" +
    "                                <select class=\"form-control\" ng-model=\"db.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                                </select>\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addType(db)\">Add Type</button>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteDB(db)\">\n" +
    "                        Delete {{db[0]}} database\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Create new Database</h3>\n" +
    "<form ng-submit=\"createDB()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Database Title\" ng-model=\"newDB.title\"\n" +
    "                       id=\"title\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Publisher\">Publisher</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Publisher\" ng-model=\"newDB.publisher\"\n" +
    "                       id=\"Publisher\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Vendor\">Vendor</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Vendor\" ng-model=\"newDB.vendor\"\n" +
    "                       id=\"Vendor\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Format\">Format</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Format\" ng-model=\"newDB.format\"\n" +
    "                       id=\"Format\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"URL\">URL</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newDB.url\"\n" +
    "                       id=\"URL\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Location\">Location</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Location\" ng-model=\"newDB.location\"\n" +
    "                       id=\"Location\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"NotInEDS\">Not in EDS</label>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newDB.notInEDS\"\n" +
    "                       id=\"NotInEDS\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Full-text\">Fulltext</label>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newDB.hasFullText\"\n" +
    "                       id=\"Full-text\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Authenticate\">Authenticate</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"Authenticate\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"Coverage\">Coverage</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Database Coverage\" ng-model=\"newDB.coverage\"\n" +
    "                       id=\"Coverage\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"Notes\">Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Notes\" ng-model=\"newDB.notes\"\n" +
    "                       id=\"Notes\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"Status\">Status</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Status\" ng-model=\"newDB.status\"\n" +
    "                       id=\"Status\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"descr\">Database Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newDB.description\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"presented\">Presented by</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Presented By\" ng-model=\"newDB.presentedBy\"\n" +
    "                       id=\"presented\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience1\">Audience One</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience One\" ng-model=\"newDB.audience1\"\n" +
    "                       id=\"Audience1\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience2\">Audience Two</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience Two\" ng-model=\"newDB.audience2\"\n" +
    "                       id=\"Audience2\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"dAuthor\">Description Author</label>\n" +
    "                <p id=\"dAuthor\">{{newDB.updatedBy}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Disable\">Disabled</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.disabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"Disable\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"tmpDisable\">TmpDisable</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.tmpDisabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"tmpDisable\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"subjects\">Subjects</label>\n" +
    "                    <ul class=\"list-group\" id=\"subjects\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"subject in newDB.subjects\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delSubjNewDB($index)\">Delete</button>\n" +
    "                            {{subject.subject}} : {{subject.type}}\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item col-md-12\">\n" +
    "                            <div class=\"col-md-7\">\n" +
    "                                <select class=\"form-control\" ng-model=\"newDB.selSubj\" ng-options=\"sub.subject for sub in DBList.subjects\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-2\">\n" +
    "                                <select class=\"form-control\" ng-model=\"newDB.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addSubjNewDB()\">Add Subject</button>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"types\">Types</label>\n" +
    "                    <ul class=\"list-group\" id=\"types\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"type in newDB.types\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delTypeNewDB($index)\">Delete</button>\n" +
    "                            {{type.type}}\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newDB.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addTypeNewDB()\">Add Type</button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\">Create Database Record</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageHours/manageEx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageEx.tpl.html",
    "<div class=\"text-right\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
    "    <br>{{resultDel}}\n" +
    "</div>\n" +
    "<table class=\"table table-hover table-condensed\" ng-repeat=\"excData in allowedLibraries.exc\" ng-if=\"$index == selLib.index\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Exception Description</th>\n" +
    "        <th class=\"text-center\">Date</th>\n" +
    "        <th class=\"text-center\">Days</th>\n" +
    "        <th class=\"text-center\">Hours</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"exception in excData track by exception.id\" ng-click=\"expandExc($event, exception)\">\n" +
    "        <td style=\"width:30%\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.desc}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.desc\" ng-required /></div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.datems | date : 'MMM d, y'}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\">\n" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                       ng-model=\"exception.datems\" is-open=\"exception.dp\"\n" +
    "                       ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExcFocus($event, $index)\" />\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.days}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.days\" ng-required /></div>\n" +
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
    "            <label for=\"isGlobal\">Create For All Libraries</label>\n" +
    "            <input type=\"checkbox\" ng-model=\"newException.isGlobal\" id=\"isGlobal\">\n" +
    "            <br>\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"createExc()\" ng-disabled=\"loading\">Create Exception</button>\n" +
    "            <br>{{result}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageHours.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHours.tpl.html",
    "<h2>Hours Management\n" +
    "\n" +
    "    <select class=\"form-control\" ng-model=\"selLib\" ng-options=\"lib.name for lib in allowedLibraries.libraries\">\n" +
    "    </select>\n" +
    "\n" +
    "</h2>\n" +
    "<h2 class=\"text-center\">{{selLib.name}}</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div semester-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
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
    "<p><strong>*</strong> Set From and To hours to Midnight in order to indicate Open 24 hours.\n" +
    "<table class=\"table table-hover table-condensed\" ng-repeat=\"semData in allowedLibraries.sem\" ng-if=\"$index == selLib.index\">\n" +
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
    "    <tr ng-repeat=\"sem in semData\" ng-click=\"expandSem($event, sem)\">\n" +
    "        <th scope=\"row\" ng-hide=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            {{sem.startdate | date : 'MMM d, y'}}<br>{{sem.enddate | date : 'MMM d, y'}}\n" +
    "        </th>\n" +
    "        <th scope=\"row\" ng-if=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" size=\"3\"\n" +
    "                       ng-model=\"sem.startdate\" is-open=\"sem.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onSemFocus($event, $index)\" />\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">Save</button>\n" +
    "                {{result}}\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteSem(sem, $index)\" ng-disabled=\"loading\">Delete {{sem.name}}</button>\n" +
    "            </div>\n" +
    "        </th>\n" +
    "        <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in sem.dow\">\n" +
    "            <div ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                {{day.hours}}\n" +
    "            </div>\n" +
    "            <div ng-if=\"isExpSem(sem.dsid)\">\n" +
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
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" placeholder=\"Start Date (MM/DD/YYYY)\"\n" +
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
    "<form ng-submit=\"addRecommendation()\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"K\">Keyword</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"addRec.keyword\"\n" +
    "                   id=\"K\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"L\">Link</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" maxlength=\"1024\"\n" +
    "                   id=\"L\" ng-model=\"addRec.link\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"LT\">Link Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" maxlength=\"100\" ng-model=\"addRec.title\"\n" +
    "                   id=\"LT\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"B\">&nbsp</label><br>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\" id=\"B\">Add Recommended Link</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "<div ng-show=\"response.length > 0\">\n" +
    "    {{response}}\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterK\">Filter by Keyword</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" id=\"filterK\" ng-model=\"filterKeyword\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterLT\">Filter by Link Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" id=\"filterLT\" ng-model=\"filterLinkTitle\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterL\">Filter by Link</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Link\" id=\"filterL\" ng-model=\"filterLink\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\"\n" +
    "         ng-repeat=\"rec in recList.RecList | filter:{keyword:filterKeyword} | filter:{link:filterLink} | filter:{description:filterLinkTitle}\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteRec(rec, $index)\">Delete</button>\n" +
    "        <span>{{rec.keyword}} = <a href=\"{{rec.link}}\">{{rec.description}}</a></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageSoftware/manageSoftware.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftware.tpl.html",
    "<h2>Manage Software</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div software-manage-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div software-manage-loc-cat>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredSW.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Location\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"sw in filteredSW = (SWList.software | filter:{title:titleFilter}\n" +
    "                                                        | filter:{description:descrFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: sw.show, sdOver: sw.sid == mOver}\" ng-mouseover=\"setOver(sw)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleSW(sw)\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"sw.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"sw.show\"></span>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px\">\n" +
    "                        <img ng-hide=\"sw.picFile[0] != null\" src=\"{{sw.icon}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"sw.picFile[0] != null\" ngf-src=\"sw.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <h4>\n" +
    "                            {{sw.title}}\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"sw.show\">\n" +
    "            <form name=\"editSW{{sw.sid}}\" ng-submit=\"updateSW(sw)\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_up\">Upload Icon</label>\n" +
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"sw.picFile\" accept=\"image/*\"\n" +
    "                               ngf-change=\"generateThumb(sw.picFile[0], $files)\" id=\"{{sw.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"sw.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{sw.picFile[0].progress}}%\" ng-bind=\"sw.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{sw.title}}\" ng-model=\"sw.title\"\n" +
    "                               id=\"{{sw.sid}}_title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_descr\">Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_descr\" ng-model=\"sw.description\" ></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_det\">Details (Get it)</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_det\" ng-model=\"sw.details\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_ver\">Versions</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_ver\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"version in sw.versions\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteVersion(sw,version)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{version.version}}\n" +
    "                                <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                                <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                                <span class=\"fa fa-fw fa-linux\" ng-show=\"version.os == 3\"></span>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"sw.newVer.version\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addVersion(sw)\"\n" +
    "                                            ng-disabled=\"sw.newVer.version.length == 0\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_links\">Links (Use it)</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_links\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"link in sw.links\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteLink(sw,link)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-5\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"sw.newLink.title\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-5\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"sw.newLink.url\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addLink(sw)\"\n" +
    "                                            ng-disabled=\"sw.newLink.title.length == 0 || sw.newLink.url.length < 2\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_loc\">Locations</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_loc\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"location in sw.locations\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteLocation(sw,location)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{location.name}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.selLoc\" ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addLocation(sw)\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_cat\">Categories</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_cat\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"category in sw.categories\">\n" +
    "                                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteCategory(sw,category)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{category.name}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addCategory(sw)\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteSW(sw)\">\n" +
    "                        Delete {{sw.title}} software\n" +
    "                    </button>\n" +
    "                    {{sw.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredSW.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add New Software</h3>\n" +
    "<form name=\"addNewSW\" ng-submit=\"createSW()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"up\">Upload Icon</label>\n" +
    "                <input type=\"file\" ngf-select=\"\" ng-model=\"newSW.picFile\" accept=\"image/*\"\n" +
    "                       ngf-change=\"generateThumb(newSW.picFile[0], $files)\" id=\"up\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <span class=\"progress\" ng-show=\"newSW.picFile[0].progress >= 0\">\n" +
    "                    <div class=\"ng-binding\" style=\"width:{{newSW.picFile[0].progress}}%\" ng-bind=\"newSW.picFile[0].progress + '%'\"></div>\n" +
    "                </span>\n" +
    "                <img ng-show=\"newSW.picFile[0] != null\" ngf-src=\"newSW.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Software Title\" ng-model=\"newSW.title\"\n" +
    "                       id=\"title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"descr\">Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newSW.description\" ></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"det\">Details (Get it)</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"det\" ng-model=\"newSW.details\" >\n" +
    "\n" +
    "                </textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"ver\">Versions</label>\n" +
    "                <ul class=\"list-group\" id=\"ver\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"version in newSW.versions\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delNewSWVer(version)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        {{version.version}}\n" +
    "                        <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-linux\" ng-show=\"version.os == 3\"></span>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"newSW.newVer.version\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNewSWVer()\"\n" +
    "                                    ng-disabled=\"newSW.newVer.version.length == 0\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"links\">Links (Use it)</label>\n" +
    "                <ul class=\"list-group\" id=\"links\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"link in newSW.links\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delNewSWLink(link)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-5\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"newSW.newLink.title\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-5\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newSW.newLink.url\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNewSWLink()\"\n" +
    "                                    ng-disabled=\"newSW.newLink.title.length == 0 || newSW.newLink.url.length < 2\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"loc\">Locations</label>\n" +
    "                <ul class=\"list-group\" id=\"loc\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"location in newSW.locations\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delNewSWLoc(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        {{location.name}}\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.selLoc\" ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNewSWLoc()\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"cat\">Categories</label>\n" +
    "                <ul class=\"list-group\" id=\"cat\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"category in newSW.categories\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delNewSWCat(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        {{category.name}}\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addNewSWCat()\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">Create Software Record</button>\n" +
    "            {{newSW.formResponse}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareLocCat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareLocCat.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Locations</h3>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th>Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"New Location\" ng-model=\"newLocation\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addLocation()\" ng-disabled=\"newLocation.length == 0\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                {{locResponse}}\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"location in SWList.locations\" ng-click=\"selectLocation(location)\">\n" +
    "                <td>\n" +
    "                    {{location.lid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"location.name\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"selLocation == location.lid\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"editLocation(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteLocation(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Categories</h3>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th>Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"New Category\" ng-model=\"newCategory\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addCategory()\" ng-disabled=\"newCategory.length == 0\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                {{catResponse}}\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"category in SWList.categories\" ng-click=\"selectCategory(category)\">\n" +
    "                <td>\n" +
    "                    {{category.cid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selCategory == category.cid\">\n" +
    "                        {{category.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selCategory == category.cid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Category Name\" ng-model=\"category.name\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"selCategory == category.cid\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"editCategory(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deleteCategory(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageUserGroups/manageUG.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/manageUG.tpl.html",
    "<h2>Web Applications Admin Interface</h2>\n" +
    "\n" +
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
    "                                    ng-show=\"$index > 0\">Remove All</button><br>\n" +
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

angular.module("manageUserGroups/viewMyWebApps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/viewMyWebApps.tpl.html",
    "<h2>My Web Applications</h2>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"webapps\">Web Application Back-End access links</label>\n" +
    "    <ul class=\"list-group\" id=\"webapps\">\n" +
    "        <li class=\"list-group-item\" ng-repeat=\"app in apps\">\n" +
    "            <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("siteFeedback/siteFeedback.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("siteFeedback/siteFeedback.tpl.html",
    "<h3>Received Feedback</h3>\n" +
    "<div class=\"row\" ng-repeat=\"record in responses\">\n" +
    "    <h4><a href=\"{{record.pageurl}}\">{{record.pageurl}}</a></h4>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"delete(record)\"\n" +
    "                    ng-show=\"false\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\">\n" +
    "            Score: {{record.score}}\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.when}}\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.ip}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        Comments: {{record.comments}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectory.tpl.html",
    "<h2>Library Staff Directory</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"text-center row form-inline\">\n" +
    "        <div class=\"col-md-5 form-group text-right\">\n" +
    "            <label for=\"sortBy\">Sort By</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'first'\"\n" +
    "                        ng-click=\"sortMode='firstname'\">\n" +
    "                    First Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'last'\"\n" +
    "                        ng-click=\"sortMode='lastname'\">\n" +
    "                    Last Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'title'\"\n" +
    "                        ng-click=\"sortMode='title'\">\n" +
    "                    Title\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-model=\"sortButton\" btn-radio=\"'dept'\"\n" +
    "                        ng-click=\"sortMode='department'\">\n" +
    "                    Department\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-7 form-group text-left\">\n" +
    "            <label for=\"filterBy\">Filter by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" ng-model=\"lastNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" ng-model=\"firstNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department\" ng-model=\"deptFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-repeat=\"person in filteredDB = (Directory.list\n" +
    "                                                        | filter:{lastname:lastNameFilter}\n" +
    "                                                        | filter:{firstname:firstNameFilter}\n" +
    "                                                        | filter:{title:titleFilter}\n" +
    "                                                        | filter:{department:deptFilter}\n" +
    "                                                        | orderBy:sortMode)\n" +
    "                                | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
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
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"deletePerson(person)\">\n" +
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
    "                            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addSubject(person)\">Assign Subject</button>\n" +
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
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
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
    "            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"addPerson()\" id=\"addButton\">Create New Record</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <p ng-model=\"formResponse\">{{formResponse}}</p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);
