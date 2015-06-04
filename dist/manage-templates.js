angular.module('manage.templates', ['manageDatabases/manageDatabases.tpl.html', 'manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageNews/manageExhibitionsList.tpl.html', 'manageNews/manageNews.tpl.html', 'manageNews/manageNewsList.tpl.html', 'manageNews/viewNewsEventsExhibitions.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageSoftware/manageSoftware.tpl.html', 'manageSoftware/manageSoftwareList.tpl.html', 'manageSoftware/manageSoftwareLocCat.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'manageUserGroups/viewMyWebApps.tpl.html', 'siteFeedback/siteFeedback.tpl.html', 'staffDirectory/staffDirectory.tpl.html', 'submittedForms/submittedForms.tpl.html']);

angular.module("manageDatabases/manageDatabases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageDatabases/manageDatabases.tpl.html",
    "<h2>Manage Databases</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
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
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Creation Date\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Last Modified\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"3\" ng-click=\"sortBy(3)\">\n" +
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
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
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
    "                    <label for=\"{{db.id}}_updatedBy\">Updated by</label>\n" +
    "                    <p id=\"{{db.id}}_updatedBy\">{{db.updatedBy}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.descrAuthor}}\" ng-model=\"db.descrAuthor\"\n" +
    "                           id=\"{{db.id}}_dAuthor\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_date1\">Created/Modified</label>\n" +
    "                    <p id=\"{{db.id}}_date1\">{{db.dateCreated}}<br>{{db.lastModified}}</p>\n" +
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
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(db,subject)\">Delete</button>\n" +
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
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject(db)\">Add Subject</button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{db.id}}_types\">Types</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteType(db,type)\">Delete</button>\n" +
    "                                {{type.type}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item form-inline\">\n" +
    "                                <select class=\"form-control\" ng-model=\"db.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                                </select>\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addType(db)\">Add Type</button>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDB(db)\">\n" +
    "                        Delete {{db[0]}} database\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
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
    "                <label for=\"dAuthor\">Description Author</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Author Name\" ng-model=\"newDB.descrAuthor\"\n" +
    "                       id=\"dAuthor\">\n" +
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
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"Notes\">Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Notes\" ng-model=\"newDB.notes\"\n" +
    "                       id=\"Notes\">\n" +
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
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delSubjNewDB($index)\">Delete</button>\n" +
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
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubjNewDB()\">Add Subject</button>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"types\">Types</label>\n" +
    "                    <ul class=\"list-group\" id=\"types\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"type in newDB.types\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delTypeNewDB($index)\">Delete</button>\n" +
    "                            {{type.type}}\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newDB.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addTypeNewDB()\">Add Type</button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\">Create Database Record</button>\n" +
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
    "    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
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
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateExc(exception)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Save</button>\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExc(exception, $index)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Delete</button>\n" +
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
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createExc()\" ng-disabled=\"loading\">Create Exception</button>\n" +
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
    "<p><strong>*</strong> Set From and To hours to Midnight in order to indicate Open 24 hours.</p>\n" +
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
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createLoc(newLocation, newParent)\" ng-disabled=\"isLoading\">Create Location</button>\n" +
    "            <br>{{result2}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageSem.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageSem.tpl.html",
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">Save</button>\n" +
    "                {{result}}\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSem(sem, $index)\" ng-disabled=\"loading\">Delete {{sem.name}}</button>\n" +
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
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createSem()\" ng-disabled=\"loading\">Create New Semester</button>\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                        ng-hide=\"expUserIndex == 0\">Save</button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">Grant Access</button><br>\n" +
    "                {{result2}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageNews/manageExhibitionsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageExhibitionsList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredExh.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Date Active From\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Date Active Until\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredExh.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredExh.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"exh in filteredExh = (data.exhibitions | filter:{title:titleFilter}\n" +
    "                                                            | filter:{description:descrFilter}\n" +
    "                                                            | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: exh.show, sdOver: exh.sid == mOver}\" ng-mouseover=\"setOver(exh)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleExhibitions(exh)\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"exh.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"exh.show\"></span>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px\">\n" +
    "                        <img ng-hide=\"exh.picFile[0] != null\" src=\"{{exh.img}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"exh.picFile[0] != null\" ngf-src=\"exh.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <h4>\n" +
    "                                {{exh.title}}\n" +
    "                            </h4>\n" +
    "                            <h4 style=\"text-align: justify;\"><small>{{exh.description}}</small></h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{exh.activeFrom | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{exh.activeUntil | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"exh.show\">\n" +
    "            <form name=\"editNewsExh{{exh.sid}}\" ng-submit=\"updateExhibition(exh)\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_up\">Upload Icon</label>\n" +
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"exh.picFile\" accept=\"image/png\"\n" +
    "                               ngf-change=\"generateThumb(exh.picFile[0], $files)\" id=\"{{exh.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"exh.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{exh.picFile[0].progress}}%\" ng-bind=\"exh.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{exh.title}}\" ng-model=\"exh.title\"\n" +
    "                               id=\"{{exh.sid}}_title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_blurb\">Short Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{exh.sid}}_blurb\" ng-model=\"exh.blurb\" ></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-9 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_descr\">Detailed Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{exh.sid}}_descr\" ng-model=\"exh.description\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_from\">Active From</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{exh.sid}}_from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"exh.activeFrom\" is-open=\"exh.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onExhDPFocusFrom($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_until\">Active Until</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{exh.sid}}_until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"exh.activeUntil\" is-open=\"exh.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onExhDPFocusUntil($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_contact\">Contact Person</label>\n" +
    "                        <select class=\"form-control\" id=\"{{exh.sid}}_contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                ng-model=\"exh.contactID\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExhibition(exh)\">\n" +
    "                        Delete Exhibition\n" +
    "                    </button>\n" +
    "                    {{exh.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredExh.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredExh.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredExh.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add Exhibition Record</h3>\n" +
    "<form name=\"addNewsExh\" ng-submit=\"createExhibition()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"up\">Upload Icon</label>\n" +
    "                <input type=\"file\" ngf-select=\"\" ng-model=\"newExh.picFile\" accept=\"image/png\"\n" +
    "                       ngf-change=\"generateThumb(newExh.picFile[0], $files)\" id=\"up\">\n" +
    "                        <span class=\"progress\" ng-show=\"newExh.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{newExh.picFile[0].progress}}%\" ng-bind=\"newExh.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"newExh.title\"\n" +
    "                       id=\"title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"blurb\">Short Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"blurb\" ng-model=\"newExh.blurb\" ></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9 form-group\">\n" +
    "                <label for=\"descr\">Detailed Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newExh.description\" ></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"from\">Active From</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newExh.activeFrom\" is-open=\"newExh.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExhDPFocusFrom($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"until\">Active Until</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newExh.activeUntil\" is-open=\"newExh.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExhDPFocusUntil($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"contact\">Contact Person</label>\n" +
    "                <select class=\"form-control\" id=\"contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                        ng-model=\"newExh.contactID\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Exhibition Record</button>\n" +
    "            {{newExh.formResponse}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageNews/manageNews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNews.tpl.html",
    "<h2>Manage News and Exhibitions</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div manage-news-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div manage-exhibitions-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageNews/manageNewsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsList.tpl.html",
    "<div>\n" +
    "    <h3>Add News Record</h3>\n" +
    "    <form name=\"addNewsExh\" ng-submit=\"createNews()\">\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"up\">Upload Icon</label>\n" +
    "                    <input type=\"file\" ngf-select=\"\" ng-model=\"newNews.picFile\" accept=\"image/png\"\n" +
    "                           ngf-change=\"generateThumb(newNews.picFile[0], $files)\" id=\"up\">\n" +
    "                        <span class=\"progress\" ng-show=\"newNews.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{newNews.picFile[0].progress}}%\" ng-bind=\"newNews.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5 form-group\">\n" +
    "                    <label for=\"title\">Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"newNews.title\"\n" +
    "                           id=\"title\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"from\">Active From</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                           ng-model=\"newNews.activeFrom\" is-open=\"newNews.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onNewsDPFocusFrom($event)\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"until\">Active Until</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                           ng-model=\"newNews.activeUntil\" is-open=\"newNews.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onNewsDPFocusUntil($event)\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-12 form-group\">\n" +
    "                    <label for=\"blurb\">Short Description</label>\n" +
    "                    <textarea class=\"form-control\" rows=\"2\" id=\"blurb\" ng-model=\"newNews.blurb\" ></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 form-group\">\n" +
    "                    <label>Detailed Description</label>\n" +
    "                    <textarea data-ui-tinymce id=\"description\" data-ng-model=\"newNews.description\" rows=\"8\"></textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h4><small>Select contact person from the list or enter new contact information</small></h4>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label for=\"contact1\">Library Faculty and Staff</label>\n" +
    "                        <select class=\"form-control\" id=\"contact1\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                ng-model=\"newNews.contactID\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label for=\"contact2\">Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"newNews.contactName\"\n" +
    "                               id=\"contact2\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label for=\"contact3\">Email</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"newNews.contactEmail\"\n" +
    "                               id=\"contact3\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label for=\"contact4\">Phone</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"newNews.contactPhone\"\n" +
    "                               id=\"contact4\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\">Create News Record</button><br>\n" +
    "                {{newNews.formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>News</h3>\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table class=\"table table-condensed table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:80px\">\n" +
    "                    Thumbnail\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\">\n" +
    "                    <a href=\"#\"\n" +
    "                       ng-click=\"sortBy(0)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                        Details\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width: 8%\">\n" +
    "                    <a href=\"#\"\n" +
    "                       ng-click=\"sortBy(1)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                        Start Date\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width: 8%\">\n" +
    "                    <a href=\"#\"\n" +
    "                       ng-click=\"sortBy(2)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                        Finish Date\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"news in filteredNews = (data.news | filter:{title:titleFilter}\n" +
    "                                                             | filter:{description:descrFilter}\n" +
    "                                                             | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "                                                             | startFrom:(currentPage-1)*perPage\n" +
    "                                                             | limitTo:perPage\"\n" +
    "                >\n" +
    "                <td ng-click=\"toggleNews(news)\">\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <a href=\"#\">\n" +
    "                                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"news.show\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"news.show\"></span>\n" +
    "                                </a>\n" +
    "                            </td>\n" +
    "                            <td style=\"width:64px\">\n" +
    "                                <img ng-hide=\"news.picFile[0] != null\" src=\"{{news.img}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                                <img ng-show=\"news.picFile[0] != null\" ngf-src=\"news.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <form name=\"editNewsExh{{news.nid}}\" ng-submit=\"updateNews(news)\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <h4>\n" +
    "                                <span ng-hide=\"news.show\" ng-click=\"toggleNews(news)\"><a href=\"#\">{{news.title}}</a></span>\n" +
    "                                <span ng-show=\"news.show\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Title\" ng-model=\"news.title\">\n" +
    "                                </span>\n" +
    "                            </h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 text-right\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"approveNews(news)\"\n" +
    "                                    ng-if=\"news.status == 0 && isAdmin\">\n" +
    "                                Approve\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <h4 style=\"text-align: justify;\">\n" +
    "                        <span ng-hide=\"news.show\" ng-click=\"toggleNews(news)\"><small>{{news.blurb}}</small></span>\n" +
    "                        <span ng-show=\"news.show\">\n" +
    "                            <textarea class=\"form-control\" rows=\"2\" ng-model=\"news.blurb\" ></textarea>\n" +
    "                        </span>\n" +
    "                    </h4>\n" +
    "                    <div ng-show=\"news.show\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_up\">Upload Icon</label>\n" +
    "                                <input type=\"file\" ngf-select=\"\" ng-model=\"news.picFile\" accept=\"image/png\"\n" +
    "                                       ngf-change=\"generateThumb(news.picFile[0], $files)\" id=\"{{news.nid}}_up\">\n" +
    "                                <span class=\"progress\" ng-show=\"news.picFile[0].progress >= 0\">\n" +
    "                                    <div class=\"ng-binding\" style=\"width:{{news.picFile[0].progress}}%\" ng-bind=\"news.picFile[0].progress + '%'\"></div>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_from\">Active From</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" id=\"{{news.nid}}_from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                       ng-model=\"news.activeFrom\" is-open=\"news.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                                       ng-focus=\"onNewsDPFocusFrom($event, $index)\"/>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_until\">Active Until</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" id=\"{{news.nid}}_until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                       ng-model=\"news.activeUntil\" is-open=\"news.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                                       ng-focus=\"onNewsDPFocusUntil($event, $index)\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-12 form-group\">\n" +
    "                                <label>Detailed Description</label>\n" +
    "                                <textarea data-ui-tinymce id=\"{{news.nid}}_descr\" data-ng-model=\"news.description\" rows=\"8\"></textarea>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <h4><small>Select contact person from the list or enter new contact information</small></h4>\n" +
    "                        <div class=\"row form-group\">\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact1\">Library Faculty and Staff</label>\n" +
    "                                <select class=\"form-control\" id=\"{{news.nid}}_contact1\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                        ng-model=\"news.contactID\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact2\">Name</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"news.contactName\"\n" +
    "                                       id=\"{{news.nid}}_contact2\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact3\">Email</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"news.contactEmail\"\n" +
    "                                       id=\"{{news.nid}}_contact3\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact4\">Phone</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"news.contactPhone\"\n" +
    "                                       id=\"{{news.nid}}_contact4\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row text-center\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteNews(news)\">\n" +
    "                                Delete News\n" +
    "                            </button><br>\n" +
    "                            {{news.formResponse}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    </form>\n" +
    "                </td>\n" +
    "                <td class=\"hidden-xs\" ng-click=\"toggleNews(news)\">\n" +
    "                    <h5>{{news.activeFrom | date : 'MMM d, y'}}</h5>\n" +
    "                </td>\n" +
    "                <td class=\"hidden-xs\" ng-click=\"toggleNews(news)\">\n" +
    "                    <h5>{{news.activeUntil | date : 'MMM d, y'}}</h5>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > perPage\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredNews.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row form-inline\">\n" +
    "    <div class=\"form-group col-md-12\">\n" +
    "        <label for=\"filterBy\">Filter <small>{{filteredNews.length}}</small> results by</label>\n" +
    "        <div id=\"filterBy\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("manageNews/viewNewsEventsExhibitions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/viewNewsEventsExhibitions.tpl.html",
    "<h2>News and Events</h2>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.news.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          News        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"news in data.news\">\n" +
    "            <div class=\"media-left\">\n" +
    "                <a href=\"#\">\n" +
    "                    <img src=\"{{news.img}}\" style=\"height: 64px; width: 64px;\"/>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">{{news.title}}</h4>\n" +
    "                {{news.blurb}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.events.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Events        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"event in data.events\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.exhibitions.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Exhibits        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"exh in data.exhibitions\">\n" +
    "            <div class=\"media-left\">\n" +
    "                <a href=\"#\">\n" +
    "                    <img src=\"{{exh.img}}\" style=\"height: 64px; width: 64px;\"/>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">{{exh.title}}</h4>\n" +
    "                {{exh.blurb}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
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
    "            <button type=\"submit\" class=\"btn btn-success\" id=\"B\">Add Recommended Link</button>\n" +
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
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteRec(rec, $index)\">Delete</button>\n" +
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
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredSW.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
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
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > perPage\"></pagination>\n" +
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
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"sw.picFile\" accept=\"image/png\"\n" +
    "                               ngf-change=\"generateThumb(sw.picFile[0], $files)\" id=\"{{sw.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"sw.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{sw.picFile[0].progress}}%\" ng-bind=\"sw.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{sw.title}}\" ng-model=\"sw.title\"\n" +
    "                               id=\"{{sw.sid}}_title\" required>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_descr\">Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_descr\" ng-model=\"sw.description\" required></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_mod\">List of Installed Modules</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_mod\" ng-model=\"sw.modules\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_links\">Links</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_links\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"link in sw.links\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLink(sw,link)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{link.description}} <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\" ng-model=\"sw.newLink.description\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"sw.newLink.title\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"sw.newLink.url\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-1\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLink(sw)\"\n" +
    "                                            ng-disabled=\"sw.newLink.title.length == 0 || sw.newLink.url.length < 2\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_ver\">Versions</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_ver\">\n" +
    "                            <li class=\"list-group-item col-md-12\" ng-repeat=\"version in sw.versions\">\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteVersion(sw,version)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    {{version.version}}\n" +
    "                                    <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-8 form-group\">\n" +
    "                                    <label for=\"{{sw.sid}}_loc\">Locations</label>\n" +
    "                                    <ul class=\"list-group\" id=\"{{sw.sid}}_loc\">\n" +
    "                                        <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(sw,version,loc)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                                </button>\n" +
    "                                                {{loc.name}}\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-5\">\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 1)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 2)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 4)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 8)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-1\">\n" +
    "\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "                                        <li class=\"list-group-item col-md-12\">\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                        ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-5\">\n" +
    "                                                <div class=\"col-md-6\" ng-repeat=\"device in version.newLoc.devices track by $index\"\n" +
    "                                                     ng-show=\"(($index == 0 || $index == 2) && version.os == 1) ||\n" +
    "                                                              (($index == 1 || $index == 3) && version.os == 2)\">\n" +
    "                                                    <input type=\"checkbox\" ng-model=\"version.newLoc.devices[$index]\">\n" +
    "                                                    <span ng-show=\"$index <= 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index > 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-1\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation(sw,version)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                                </button>\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-6\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"sw.newVer.version\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addVersion(sw)\"\n" +
    "                                            ng-disabled=\"sw.newVer.version.length == 0\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_cat\">Categories</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_cat\">\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-2\" ng-repeat=\"category in sw.categories\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(sw,category)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    {{category.name}}\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-6\">\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory(sw)\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSW(sw)\">\n" +
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
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > perPage\"></pagination>\n" +
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
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newSW.description\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"mod\">List of Installed Modules</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"mod\" ng-model=\"newSW.modules\" ></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"links\">Links</label>\n" +
    "                <ul class=\"list-group\" id=\"links\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"link in newSW.links\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWLink(link)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        {{link.description}} <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\" ng-model=\"newSW.newLink.description\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"newSW.newLink.title\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newSW.newLink.url\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWLink()\"\n" +
    "                                    ng-disabled=\"newSW.newLink.title.length == 0 || newSW.newLink.url.length < 2\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"ver\">Versions</label>\n" +
    "                <ul class=\"list-group\" id=\"ver\">\n" +
    "                    <li class=\"list-group-item col-md-12\" ng-repeat=\"version in newSW.versions\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWVer(version)\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            {{version.version}}\n" +
    "                            <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8 form-group\">\n" +
    "                            <label for=\"loc\">Locations</label>\n" +
    "                            <ul class=\"list-group\" id=\"loc\">\n" +
    "                                <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWLoc(version,loc)\">\n" +
    "                                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                        </button>\n" +
    "                                        {{loc.name}}\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-5\">\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 1)\">\n" +
    "                                            <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 2)\">\n" +
    "                                            <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 4)\">\n" +
    "                                            <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 8)\">\n" +
    "                                            <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-1\">\n" +
    "\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                                <li class=\"list-group-item col-md-12\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-5\">\n" +
    "                                        <div class=\"col-md-6\" ng-repeat=\"device in version.newLoc.devices track by $index\"\n" +
    "                                                ng-show=\"(($index == 0 || $index == 2) && version.os == 1) ||\n" +
    "                                                         (($index == 1 || $index == 3) && version.os == 2)\">\n" +
    "                                            <input type=\"checkbox\" ng-model=\"version.newLoc.devices[$index]\">\n" +
    "                                                    <span ng-show=\"$index <= 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index > 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-1\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWLoc(version)\">\n" +
    "                                            <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-6\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"newSW.newVer.version\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWVer()\"\n" +
    "                                    ng-disabled=\"newSW.newVer.version.length == 0\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"cat\">Categories</label>\n" +
    "                <ul class=\"list-group\" id=\"cat\">\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-2\" ng-repeat=\"category in newSW.categories\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWCat(category)\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            {{category.name}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-6\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWCat()\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Software Record</button>\n" +
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
    "                <th>Parent ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th>Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"newLocation.parent\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"New Location Name\" ng-model=\"newLocation.name\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation()\" ng-disabled=\"newLocation.name.length == 0\">\n" +
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
    "                        {{location.parent}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"location.parent\">\n" +
    "                    </span>\n" +
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
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editLocation(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(location)\">\n" +
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
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory()\" ng-disabled=\"newCategory.length == 0\">\n" +
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
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editCategory(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(category)\">\n" +
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
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                                    ng-show=\"$index > 0\">Save</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
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
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">\n" +
    "                                Grant Access Rights\n" +
    "                            </button><br>\n" +
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
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delete(record)\"\n" +
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
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'first'\"\n" +
    "                        ng-click=\"sortMode='firstname'\">\n" +
    "                    First Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'last'\"\n" +
    "                        ng-click=\"sortMode='lastname'\">\n" +
    "                    Last Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'title'\"\n" +
    "                        ng-click=\"sortMode='title'\">\n" +
    "                    Title\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'dept'\"\n" +
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
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
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
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updatePerson(person)\">Update information</button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deletePerson(person)\">\n" +
    "                        Delete {{person.firstname}} {{person.lastname}} record\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h5>LibGuide Subjects</h5>\n" +
    "                    <dd>\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li  ng-repeat=\"subject in person.subjects\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"deleteSubject(person, subject.id, $index)\">\n" +
    "                                    Delete\n" +
    "                                </button>\n" +
    "                                <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"person.selSubj\" ng-options=\"sub.subject for sub in Directory.subjects\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"addSubject(person)\">Assign Subject</button>\n" +
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
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
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
    "            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"addPerson()\" id=\"addButton\">Create New Record</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <p ng-model=\"formResponse\">{{formResponse}}</p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("submittedForms/submittedForms.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("submittedForms/submittedForms.tpl.html",
    "<h2>Manage Submitted Forms</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredForms.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Status\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Date Submitted\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"form in filteredForms = (data.forms | filter:{title:titleFilter}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: form.show, sdOver: form.sid == mOver}\" ng-mouseover=\"setOver(form)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleForms(form)\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"form.show\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"form.show\"></span>\n" +
    "                    {{form.title}}\n" +
    "                    <small>{{form.status}}</small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <h5>{{form.created}}</h5>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"form.show\">\n" +
    "            <div class=\"col-md-6 panel panel-default\" ng-repeat=\"field in form.fields\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <h4 class=\"panel-title\">{{field.name}}</h4>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    {{field.value}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredForms.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "");
}]);
