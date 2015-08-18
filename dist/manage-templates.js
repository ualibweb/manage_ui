angular.module('manage.templates', ['manageDatabases/manageDatabases.tpl.html', 'manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageNews/manageNews.tpl.html', 'manageNews/manageNewsAdmins.tpl.html', 'manageNews/manageNewsList.tpl.html', 'manageOneSearch/mainOneSearch.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageOneSearch/oneSearchStat.tpl.html', 'manageSoftware/manageSoftware.tpl.html', 'manageSoftware/manageSoftwareComputerMaps.tpl.html', 'manageSoftware/manageSoftwareList.tpl.html', 'manageSoftware/manageSoftwareLocCat.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'manageUserGroups/viewMyWebApps.tpl.html', 'siteFeedback/siteFeedback.tpl.html', 'staffDirectory/staffDirectory.tpl.html', 'staffDirectory/staffDirectoryDepartments.tpl.html', 'staffDirectory/staffDirectoryPeople.tpl.html', 'staffDirectory/staffDirectorySubjects.tpl.html', 'submittedForms/submittedForms.tpl.html']);

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
    "    <div class=\"row row-clickable\"\n" +
    "         ng-repeat=\"db in filteredDB = (DBList.databases | filter:{title:titleStartFilter}:startTitle\n" +
    "                                                         | filter:{title:titleFilter}\n" +
    "                                                         | filter:{description:descrFilter}\n" +
    "                                                         | filter:{subjects:subjectFilter}\n" +
    "                                                         | filter:{types:typeFilter}\n" +
    "                                                         | filter:{disabled:disFilter.value}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: db.show}\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleDB(db)\" style=\"cursor: pointer;\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    <a>\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                    </a>\n" +
    "                    <a>{{db.title}}</a>\n" +
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
    "                           id=\"{{db.id}}_title\" maxlength=\"200\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.publisher}}\" ng-model=\"db.publisher\"\n" +
    "                           id=\"{{db.id}}_Publisher\" maxlength=\"100\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.vendor}}\" ng-model=\"db.vendor\"\n" +
    "                           id=\"{{db.id}}_Vendor\" maxlength=\"100\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Format\">Format</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.format}}\" ng-model=\"db.format\"\n" +
    "                           id=\"{{db.id}}_Format\" maxlength=\"50\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_URL\">URL</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.url}}\" ng-model=\"db.url\"\n" +
    "                           id=\"{{db.id}}_URL\" maxlength=\"2000\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.location}}\" ng-model=\"db.location\"\n" +
    "                           id=\"{{db.id}}_Location\" maxlength=\"50\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_NotInEDS\">In EDS</label>\n" +
    "                    <select class=\"form-control\" ng-model=\"db.notInEDS\" ng-options=\"val for val in inEDSValues\"\n" +
    "                            id=\"{{db.id}}_NotInEDS\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                    <select class=\"form-control\" ng-model=\"db.hasFullText\" ng-options=\"val for val in fullTextValues\"\n" +
    "                            id=\"{{db.id}}_Full-text\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_Authenticate\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.coverage}}\" ng-model=\"db.coverage\"\n" +
    "                           id=\"{{db.id}}_Coverage\" maxlength=\"256\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notes}}\" ng-model=\"db.notes\"\n" +
    "                           id=\"{{db.id}}_Notes\" maxlength=\"100\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Status\">Status</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.status}}\" ng-model=\"db.status\"\n" +
    "                           id=\"{{db.id}}_Status\" maxlength=\"100\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 form-group\">\n" +
    "                    <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                    <textarea class=\"form-control\" rows=\"3\" id=\"{{db.id}}_descr\" ng-model=\"db.description\" maxlength=\"4096\"></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_presented\">PresentedBy</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.presentedBy}}\" ng-model=\"db.presentedBy\"\n" +
    "                           id=\"{{db.id}}_presented\" maxlength=\"50\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience1\">Audience1</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience1}}\" ng-model=\"db.audience1\"\n" +
    "                           id=\"{{db.id}}_Audience1\" maxlength=\"30\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience2\">Audience2</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience2}}\" ng-model=\"db.audience2\"\n" +
    "                           id=\"{{db.id}}_Audience2\" maxlength=\"30\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_updatedBy\">Updated by</label>\n" +
    "                    <p id=\"{{db.id}}_updatedBy\">{{db.updatedBy}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.descrAuthor}}\" ng-model=\"db.descrAuthor\"\n" +
    "                           id=\"{{db.id}}_dAuthor\" maxlength=\"50\">\n" +
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
    "                       id=\"title\" maxlength=\"200\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Publisher\">Publisher</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Publisher\" ng-model=\"newDB.publisher\"\n" +
    "                       id=\"Publisher\" maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Vendor\">Vendor</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Vendor\" ng-model=\"newDB.vendor\"\n" +
    "                       id=\"Vendor\" maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Format\">Format</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Format\" ng-model=\"newDB.format\"\n" +
    "                       id=\"Format\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"URL\">URL</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newDB.url\"\n" +
    "                       id=\"URL\" maxlength=\"2000\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"Location\">Location</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Location\" ng-model=\"newDB.location\"\n" +
    "                       id=\"Location\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"NotInEDS\">In EDS</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newDB.notInEDS\" ng-options=\"val for val in inEDSValues\"\n" +
    "                        id=\"NotInEDS\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Full-text\">Fulltext</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newDB.hasFullText\" ng-options=\"val for val in fullTextValues\"\n" +
    "                        id=\"Full-text\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Authenticate\">Authenticate</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"Authenticate\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"Coverage\">Coverage</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Database Coverage\" ng-model=\"newDB.coverage\"\n" +
    "                       id=\"Coverage\" maxlength=\"256\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"dAuthor\">Description Author</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Author Name\" ng-model=\"newDB.descrAuthor\"\n" +
    "                       id=\"dAuthor\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"Status\">Status</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Status\" ng-model=\"newDB.status\"\n" +
    "                       id=\"Status\" maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"descr\">Database Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newDB.description\" maxlength=\"4096\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"presented\">Presented by</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Presented By\" ng-model=\"newDB.presentedBy\"\n" +
    "                       id=\"presented\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience1\">Audience One</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience One\" ng-model=\"newDB.audience1\"\n" +
    "                       id=\"Audience1\" maxlength=\"30\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience2\">Audience Two</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience Two\" ng-model=\"newDB.audience2\"\n" +
    "                       id=\"Audience2\" maxlength=\"30\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"Notes\">Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Notes\" ng-model=\"newDB.notes\"\n" +
    "                       id=\"Notes\" maxlength=\"100\">\n" +
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
    "            <div class=\"row\">\n" +
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
    "                <button type=\"submit\" class=\"btn btn-success\">Create Database Record</button><br>\n" +
    "                {{formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageHours/manageEx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageEx.tpl.html",
    "<div>\n" +
    "    <h3>List of Exceptions</h3>\n" +
    "    <div class=\"text-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
    "        <br>{{resultDel}}\n" +
    "    </div>\n" +
    "    <table class=\"table table-hover table-condensed\" ng-repeat=\"excData in allowedLibraries.exc\" ng-if=\"$index == selLib.index\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>Exception Description</th>\n" +
    "            <th class=\"text-center\" style=\"width:140px;\">Date</th>\n" +
    "            <th class=\"text-center\" style=\"width:80px;\">Days</th>\n" +
    "            <th class=\"text-center\" style=\"width:320px;\">Hours</th>\n" +
    "            <th class=\"text-center\" style=\"width:120px;\">Action</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tr ng-repeat=\"exception in excData track by exception.id\" ng-click=\"expandExc($event, exception)\">\n" +
    "            <td style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\"><a>{{exception.desc}}</a></div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.desc\" ng-required /></div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\" style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\">{{exception.datems | date : 'MMM d, y'}}</div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\">\n" +
    "\n" +
    "                    <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                           ng-model=\"exception.datems\" is-open=\"exception.dp\"\n" +
    "                           ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onExcFocus($event, $index)\" />\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\" style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\">{{exception.days}}</div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.days\" ng-required /></div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <select class=\"form-control\" ng-model=\"exception.from\">\n" +
    "                            <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{exception.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <select class=\"form-control\" ng-model=\"exception.to\">\n" +
    "                            <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{exception.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"form-group text-center\">\n" +
    "                <div ng-show=\"isExpExc(exception.id)\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateExc(exception)\" ng-disabled=\"loading\">\n" +
    "                        <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExc(exception, $index)\" ng-disabled=\"loading\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                    <br>{{result}}\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr class=\"sdOpen\">\n" +
    "            <td>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newException.desc\" placeholder=\"Exception Description\" ng-required />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" show-button-bar=\"false\"\n" +
    "                       ng-model=\"newException.datems\" is-open=\"newException.dp\" close-text=\"Close\"\n" +
    "                       ng-required=\"true\" placeholder=\"MM/DD/YYYY\" ng-focus=\"onExcFocus($event)\" />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newException.days\" placeholder=\"Days\" ng-required />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newException.from\">\n" +
    "                            <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{newException.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newException.to\">\n" +
    "                            <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{newException.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"form-group text-right\">\n" +
    "                <label for=\"isGlobal\">Create For All Libraries</label>\n" +
    "                <input type=\"checkbox\" ng-model=\"newException.isGlobal\" id=\"isGlobal\">\n" +
    "                <br>\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createExc()\"\n" +
    "                        ng-disabled=\"loading || newException.desc.length < 1 || !(newException.days > 0) || newException.datems.length < 1\">\n" +
    "                    Create Exception\n" +
    "                </button>\n" +
    "                <br>{{result}}\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("manageHours/manageHours.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHours.tpl.html",
    "<h2>\n" +
    "    Manage Hours <small>{{selLib.name}}</small>\n" +
    "</h2>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <select class=\"form-control\" ng-model=\"selLib\" ng-options=\"lib.name for lib in allowedLibraries.libraries\">\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-warning\" role=\"alert\">\n" +
    "    <span class=\"fa fa-exclamation-triangle\"></span> Warning: Please use exceptions in order to create periods with the non\n" +
    "    standard hours (for example, Finals week).\n" +
    "</div>\n" +
    "<div class=\"alert alert-info\" role=\"alert\">\n" +
    "    <span class=\"fa fa-info-circle\"></span> Note: set <strong>From</strong> and <strong>To</strong> hours to\n" +
    "    <strong>Midnight</strong> in order to indicate <strong>Open 24 hours</strong>.\n" +
    "</div>\n" +
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
    "<div>\n" +
    "    <h3>Semester List</h3>\n" +
    "    <table class=\"table table-hover table-condensed\" ng-repeat=\"semData in allowedLibraries.sem\" ng-if=\"$index == selLib.index\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>Semester</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Sun</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Mon</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Tue</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Wed</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Thu</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Fri</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Sat</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tr ng-repeat=\"sem in semData\" ng-click=\"expandSem($event, sem)\" style=\"cursor: pointer;\">\n" +
    "            <th ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                <h4><a>{{sem.name}}</a></h4>\n" +
    "                {{sem.startdate | date : 'MMM d, y'}}<br>{{sem.enddate | date : 'MMM d, y'}}\n" +
    "            </th>\n" +
    "            <th ng-if=\"isExpSem(sem.dsid)\">\n" +
    "                <h4><a>{{sem.name}}</a></h4>\n" +
    "                <div class=\"col-md-7 form-group\">\n" +
    "                    <label for=\"{{sem.dsid}}_startDate\">Start Date</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" size=\"3\"\n" +
    "                           ng-model=\"sem.startdate\" is-open=\"sem.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onSemFocus($event, $index)\" id=\"{{sem.dsid}}_startDate\" placeholder=\"MM/DD/YYYY\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5 form-group\">\n" +
    "                    <div id=\"{{sem.dsid}}_action\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSem(sem, $index)\" ng-disabled=\"loading\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button><br>\n" +
    "                        {{result}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </th>\n" +
    "            <td class=\"text-center\" ng-repeat=\"day in sem.dow\">\n" +
    "                <div ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                    {{day.hours}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"isExpSem(sem.dsid)\">\n" +
    "                    <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                    <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "\n" +
    "    <h3>Create New Semester</h3>\n" +
    "    <div class=\"sdOpen\">\n" +
    "        <table class=\"table table-hover table-condensed\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Semester</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Sun</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Mon</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Tue</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Wed</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Thu</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Fri</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Sat</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tr>\n" +
    "                <th>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-minlength=\"4\" ng-maxlength=\"32\" ng-model=\"newSemester.name\" placeholder=\"Semester Name\" ng-required /><br>\n" +
    "                        <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" placeholder=\"Start Date (MM/DD/YYYY)\"\n" +
    "                               ng-model=\"newSemester.startdate\" is-open=\"newSemester.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onSemFocus($event)\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"createSem()\"\n" +
    "                                ng-disabled=\"loading || newSemester.name.length < 1 || newSemester.startdate.length < 1\">\n" +
    "                            Create New Semester\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    {{result}}\n" +
    "                </th>\n" +
    "                <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in newSemester.dow\">\n" +
    "                    <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                    <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
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
    "    <tr ng-repeat=\"user in dataUL.users | orderBy:'name'\" ng-click=\"expandUser(user)\">\n" +
    "        <th scope=\"row\">{{user.fullName}}\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\">\n" +
    "                    Save\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\">\n" +
    "                    Delete\n" +
    "                </button><br>\n" +
    "                {{result}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.fullName for user in users | orderBy:'fullName'\">\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading || newUser.login.length <= 1\">\n" +
    "                    Grant Access\n" +
    "                </button><br>\n" +
    "                {{result2}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
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
    "            <div manage-admins-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageNews/manageNewsAdmins.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsAdmins.tpl.html",
    "<div class=\"row\" ng-if=\"isAdmin\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">People who can approve submitted News and Exhibits</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"admin in data.admins\">\n" +
    "                        {{admin.name}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-if=\"!isAdmin\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">People who can approve submitted News and Exhibits</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"admin in data.admins\">\n" +
    "                        {{admin.name}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageNews/manageNewsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsList.tpl.html",
    "<div>\n" +
    "    <form name=\"addNewsExh\" ng-submit=\"createNews()\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-12 sdOpen\">\n" +
    "                    <h3>Add News Record</h3>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"title\">Title</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"newNews.title\"\n" +
    "                                   id=\"title\" maxlength=\"100\" required>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"sticky\">Make Sticky</label>\n" +
    "                            <div class=\"checkbox text-center\" id=\"sticky\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"newNews.sticky\" ng-true-value=\"1\" ng-false-value=\"0\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"from\">Active From</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                   ng-model=\"newNews.activeFrom\" is-open=\"newNews.dpFrom\" close-text=\"Close\"\n" +
    "                                   ng-focus=\"onNewsDPFocusFrom($event)\"/>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"until\">Active Until</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                   ng-model=\"newNews.activeUntil\" is-open=\"newNews.dpUntil\" close-text=\"Close\"\n" +
    "                                   ng-focus=\"onNewsDPFocusUntil($event)\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"browse\">Select Images</label>\n" +
    "                            <div id=\"browse\">\n" +
    "                                <button type=\"file\" ngf-select=\"\" ng-model=\"newNews.picFile\" accept=\"image/*\" ngf-multiple=\"true\"\n" +
    "                                   ngf-change=\"generateThumb(newNews.picFile, null)\" class=\"btn btn-success\">\n" +
    "                                    <span class=\"fa fa-fw fa-plus\"></span>Browse\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-10 form-group\">\n" +
    "                            <label for=\"selected\">Selected Images</label>\n" +
    "                            <div id=\"selected\">\n" +
    "                                <div class=\"col-md-3\" ng-repeat=\"img in newNews.selectedFiles\">\n" +
    "                                    <img ngf-src=\"img\" width=\"150px\" height=\"100px\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"newNews.selectedFiles.splice($index,1)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"col-md-12 form-group\">\n" +
    "                            <label>Detailed Description</label>\n" +
    "                            <textarea data-ui-tinymce id=\"description\" data-ng-model=\"newNews.description\" rows=\"5\"\n" +
    "                                      maxlength=\"64000\" required></textarea>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <h4><small>Select contact person from the list or enter new contact information</small></h4>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"contact1\">Library Faculty and Staff</label>\n" +
    "                                <select class=\"form-control\" id=\"contact1\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                        ng-model=\"newNews.contactID\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"contact2\">Name</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"newNews.contactName\"\n" +
    "                                       id=\"contact2\" maxlength=\"60\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"contact3\">Email</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"newNews.contactEmail\"\n" +
    "                                       id=\"contact3\"  maxlength=\"1024\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"contact4\">Phone</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"newNews.contactPhone\"\n" +
    "                                       id=\"contact4\" maxlength=\"20\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center form-group\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">Create New Record</button><br>\n" +
    "                        {{newNews.formResponse}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>News</h3>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredNews.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
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
    "                    <a\n" +
    "                       ng-click=\"sortBy(0)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                        Details\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width: 8%\">\n" +
    "                    <a\n" +
    "                       ng-click=\"sortBy(1)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                        Date\n" +
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
    "                <td ng-click=\"toggleNews(news)\" style=\"cursor: pointer;\">\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <a>\n" +
    "                                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"news.show\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"news.show\"></span>\n" +
    "                                </a>\n" +
    "                            </td>\n" +
    "                            <td style=\"width:64px\">\n" +
    "                                <img ng-show=\"news.tb.length > 0\" src=\"{{news.tb}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                                <img ng-hide=\"news.tb.length > 0\" ngf-src=\"news.selectedFiles[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <h4 style=\"cursor: pointer;\" ng-click=\"toggleNews(news)\">\n" +
    "                                <a>{{news.title}}</a>\n" +
    "                                <small>{{news.creator}}</small>\n" +
    "                            </h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 text-right\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"approveNews(news)\"\n" +
    "                                    ng-if=\"news.status == 0 && isAdmin\">\n" +
    "                                Approve\n" +
    "                            </button>\n" +
    "                            <span ng-if=\"news.status == 0 && !isAdmin\">Approval Pending</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <form name=\"editNewsExh{{news.nid}}\" ng-submit=\"updateNews(news)\" ng-if=\"news.show\">\n" +
    "                    <div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-6 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_title\">Title</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"news.title\"\n" +
    "                                       id=\"{{news.nid}}_title\" maxlength=\"100\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-2 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_sticky\">Sticky</label>\n" +
    "                                <div class=\"checkbox text-center\" id=\"{{news.nid}}_sticky\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"news.sticky\" ng-true-value=\"1\" ng-false-value=\"0\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-2 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_from\">Active From</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" id=\"{{news.nid}}_from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                       ng-model=\"news.activeFrom\" is-open=\"news.dpFrom\" close-text=\"Close\"\n" +
    "                                       ng-focus=\"onNewsDPFocusFrom($event, news)\"/>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-2 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_until\">Active Until</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" id=\"{{news.nid}}_until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                                       ng-model=\"news.activeUntil\" is-open=\"news.dpUntil\" close-text=\"Close\"\n" +
    "                                       ng-focus=\"onNewsDPFocusUntil($event, news)\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-2 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_browse\">Select Images</label>\n" +
    "                                <div id=\"{{news.nid}}_browse\">\n" +
    "                                    <button type=\"file\" ngf-select=\"\" ng-model=\"news.picFile\" accept=\"image/*\" ngf-multiple=\"true\"\n" +
    "                                            ngf-change=\"generateThumb(news.picFile, news)\" class=\"btn btn-success\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>Browse\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-10 form-group\">\n" +
    "                                <label for=\"{{news.nid}}_uploaded\">Uploaded Images</label>\n" +
    "                                <div id=\"{{news.nid}}_uploaded\">\n" +
    "                                    <div class=\"col-md-3\" ng-repeat=\"img in news.images\">\n" +
    "                                        <img src=\"{{img.image}}\" width=\"150px\" height=\"100px\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"news.images.splice($index,1)\">\n" +
    "                                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-3\" ng-repeat=\"img in news.selectedFiles\">\n" +
    "                                        <img ngf-src=\"img\" width=\"150px\" height=\"100px\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"news.selectedFiles.splice($index,1)\">\n" +
    "                                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-12 form-group\">\n" +
    "                                <label>Detailed Description</label>\n" +
    "                                <textarea data-ui-tinymce id=\"{{news.nid}}_descr\" data-ng-model=\"news.description\" rows=\"5\"\n" +
    "                                         maxlength=\"64000\" required></textarea>\n" +
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
    "                                       id=\"{{news.nid}}_contact2\" maxlength=\"60\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact3\">Email</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"news.contactEmail\"\n" +
    "                                       id=\"{{news.nid}}_contact3\" maxlength=\"1024\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"{{news.nid}}_contact4\">Phone</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"news.contactPhone\"\n" +
    "                                       id=\"{{news.nid}}_contact4\" maxlength=\"20\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row text-center\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">Update information</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteNews(news)\">\n" +
    "                                Delete News\n" +
    "                            </button><br>\n" +
    "                            {{news.formResponse}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    </form>\n" +
    "                </td>\n" +
    "                <td class=\"hidden-xs\" ng-click=\"toggleNews(news)\" style=\"cursor: pointer;\">\n" +
    "                    <h5>{{news.created | date : 'MMM d, y'}}</h5>\n" +
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
    "");
}]);

angular.module("manageOneSearch/mainOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/mainOneSearch.tpl.html",
    "<h2>Manage OneSearch</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div recommended-links-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div search-statistics-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>");
}]);

angular.module("manageOneSearch/manageOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/manageOneSearch.tpl.html",
    "<h3>OneSearch Recommended Links</h3>\n" +
    "\n" +
    "<form ng-submit=\"addRecommendation()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"K\">Keyword</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"addRec.keyword\"\n" +
    "                   id=\"K\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"L\">Link URL</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" maxlength=\"1024\"\n" +
    "                   id=\"L\" ng-model=\"addRec.link\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"LT\">Link Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" maxlength=\"100\" ng-model=\"addRec.description\"\n" +
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
    "\n" +
    "<div class=\"row form-inline\">\n" +
    "    <div class=\"form-group col-md-12\">\n" +
    "        <label for=\"filterBy\">Filter <small>{{filteredList.length}}</small> results by</label>\n" +
    "        <div id=\"filterBy\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword contains\" ng-model=\"filterKeyword\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"filterLinkTitle\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"URL contains\" ng-model=\"filterLink\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"hidden-xs\" style=\"width:20%\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(0)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                    Keyword\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(1)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                    Title\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(2)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                    URL\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th style=\"width:120px\">\n" +
    "                Action\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"rec in (filteredList = recList.RecList | filter:{keyword:filterKeyword}\n" +
    "                                                              | filter:{link:filterLink}\n" +
    "                                                              | filter:{description:filterLinkTitle}\n" +
    "                                                              | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\"\n" +
    "                ng-click=\"expand(rec)\">\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\">{{rec.keyword}}</span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"rec.keyword\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\">{{rec.description}}</span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"100\" ng-model=\"rec.description\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\"><a href=\"{{rec.link}}\">{{rec.link}}</a></span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"URL\" maxlength=\"1024\" ng-model=\"rec.link\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateRec(rec)\">\n" +
    "                        <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteRec(rec, $index)\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageOneSearch/oneSearchStat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/oneSearchStat.tpl.html",
    "<h3>OneSearch Statistics</h3>\n" +
    "\n" +
    "\n" +
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th style=\"width:80px;\">\n" +
    "                Number\n" +
    "            </th>\n" +
    "            <th>\n" +
    "                Keyword\n" +
    "            </th>\n" +
    "            <th style=\"width:150px;\">\n" +
    "                Count\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"stat in statList\">\n" +
    "            <td>\n" +
    "                {{$index}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{stat.keyword}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{stat.count}}\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
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
    "        <div ng-if=\"tab.number == 2\" >\n" +
    "            <div software-manage-computer-maps>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareComputerMaps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareComputerMaps.tpl.html",
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <form class=\"form-inline\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"plan\">Choose Floor Plan</label>\n" +
    "                <select class=\"form-control\" ng-model=\"selMap\" ng-change=\"updateMap()\" id=\"plan\"\n" +
    "                        ng-options=\"map.name for map in SWList.maps | orderBy:'name'\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info\" role=\"alert\">\n" +
    "        <span class=\"fa fa-exclamation-triangle\"></span> Note: Right-click on the floor plan map in order to add a computer or left-click on existing one in order to edit it.\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"comps-map\" id=\"computer-map\"\n" +
    "             style=\"background: transparent url('//wwwdev.lib.ua.edu/softwareList/floorMaps/{{selMap.floor_plan_file}}') no-repeat 0 0;\n" +
    "                    width:{{selMap.width}}px;\n" +
    "                    height:{{selMap.height}}px;\n" +
    "                    clear: both;\"\n" +
    "             ng-mousedown=\"createComp($event)\"\n" +
    "            >\n" +
    "            <span class=\"comp-normal\"\n" +
    "                 ng-repeat=\"comp in selMap.computers\"\n" +
    "                 style=\"left:{{comp.mapX}}px;top:{{comp.mapY}}px;position: absolute;\"\n" +
    "                 ng-click=\"expand($index)\"\n" +
    "                 ng-class=\"{\n" +
    "                 'fa fa-windows': comp.type == 1,\n" +
    "                 'fa fa-apple': comp.type == 2,\n" +
    "                 'comp-selected': selComp == $index,\n" +
    "                 'comp-turned-off': comp.status !== 1\n" +
    "                 }\"\n" +
    "                    >\n" +
    "            </span>\n" +
    "            <div class=\"selected-form\" ng-show=\"selComp >= 0\" style=\"left:{{selCompX}}px;top:{{selCompY}}px;\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4>&nbsp; Computer ID: {{selMap.computers[selComp].compid}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 text-right\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"selComp = -1\" style=\"left:450px;top:-15px;\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <form ng-submit=\"updateComp()\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_X\">Coordinate X</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"X\" ng-model=\"selMap.computers[selComp].mapX\" id=\"sel_X\"\n" +
    "                                       maxlength=\"4\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_Y\">Coordinate Y</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Y\" ng-model=\"selMap.computers[selComp].mapY\" id=\"sel_Y\"\n" +
    "                                       maxlength=\"4\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_status\">Status</label>\n" +
    "                                <select class=\"form-control\" ng-model=\"selCompStatus\" ng-options=\"status.name for status in compStatus\"\n" +
    "                                        id=\"sel_status\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"sel_name\">Computer Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter Computer Name\" ng-model=\"selMap.computers[selComp].name\"\n" +
    "                               id=\"sel_name\" maxlength=\"100\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"sel_os\">OS</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"selCompOS\" ng-options=\"opSys.name for opSys in os\" id=\"sel_os\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"sel_loc\">Location</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"selCompLoc\"\n" +
    "                                ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\" id=\"sel_loc\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center form-group\">\n" +
    "                        <label></label>\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"selMap.computers[selComp].name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span> Update Information\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteComp()\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span> Delete Computer\n" +
    "                        </button><br>\n" +
    "                        {{compResponse}}\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class=\"selected-form row\" ng-show=\"showCreate\"\n" +
    "                 style=\"left:{{newComp.mapX}}px;top:{{newComp.mapY}}px;\"\n" +
    "                    >\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <h4>New Computer</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4 text-right\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showCreate = false\" style=\"left:450px;top:-15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <form ng-submit=\"addComp()\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_X\">Coordinate X</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"X\" ng-model=\"newComp.mapX\" id=\"newComp_X\"\n" +
    "                               maxlength=\"4\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_Y\">Coordinate Y</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Y\" ng-model=\"newComp.mapY\" id=\"newComp_Y\"\n" +
    "                               maxlength=\"4\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_name\">Computer Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter Computer Name\" ng-model=\"newComp.name\"\n" +
    "                               id=\"newComp_name\" maxlength=\"100\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_os\">OS</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newComp.selType\" ng-options=\"opSys.name for opSys in os\" id=\"newComp_os\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"newComp_loc\">Location</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newComp.selLoc\"\n" +
    "                                ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\" id=\"newComp_loc\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center form-group\">\n" +
    "                        <label></label>\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"newComp.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-plus\"></span> Create Computer\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("manageSoftware/manageSoftwareList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <label for=\"filterBy\">Filter <small>{{filteredSW.length}}</small> results by</label>\n" +
    "                <div id=\"filterBy\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <label for=\"sortBy\">Sort by</label>\n" +
    "                <div id=\"sortBy\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                        Title\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                        Status\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row row-clickable\"\n" +
    "         ng-repeat=\"sw in filteredSW = (SWList.software | filter:{title:titleFilter}\n" +
    "                                                        | filter:{description:descrFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: sw.show}\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleSW(sw)\" style=\"cursor: pointer;\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <a>\n" +
    "                            <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"sw.show\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-caret-down\" ng-show=\"sw.show\"></span>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px;\">\n" +
    "                        <img ng-hide=\"sw.picFile[0] != null\" src=\"{{sw.icon}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"sw.picFile[0] != null\" ngf-src=\"sw.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <h4>\n" +
    "                            <a>{{sw.title}}</a>\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                    <td style=\"width: 79px;\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"publishSW(sw)\" ng-show=\"sw.status == 0\">\n" +
    "                            Publish\n" +
    "                        </button>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-if=\"sw.show\">\n" +
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
    "                               id=\"{{sw.sid}}_title\" maxlength=\"50\" required>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_descr\">Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_descr\" ng-model=\"sw.description\"\n" +
    "                                  maxlength=\"4096\" required></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_mod\">List of Installed Modules</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_mod\" ng-model=\"sw.modules\"\n" +
    "                                  maxlength=\"4096\"></textarea>\n" +
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
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\"\n" +
    "                                           ng-model=\"sw.newLink.description\" maxlength=\"200\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\"\n" +
    "                                           ng-model=\"sw.newLink.title\" maxlength=\"100\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\"\n" +
    "                                           ng-model=\"sw.newLink.url\" maxlength=\"1024\">\n" +
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
    "                                <div class=\"col-md-1\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteVersion(sw,version)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"version.version\"\n" +
    "                                           maxlength=\"50\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-8 form-group\">\n" +
    "                                    <label for=\"{{sw.sid}}_loc\">Locations</label>\n" +
    "                                    <ul class=\"list-group\" id=\"{{sw.sid}}_loc\">\n" +
    "                                        <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                                            <div class=\"col-md-8\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(sw,version,loc)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                                </button>\n" +
    "                                                {{loc.name}}\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-4\">\n" +
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
    "                                        </li>\n" +
    "                                        <li class=\"list-group-item col-md-12\">\n" +
    "                                            <div class=\"col-md-8\">\n" +
    "                                                <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                        ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\">\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-3\">\n" +
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
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"sw.newVer.version\"\n" +
    "                                           maxlength=\"50\">\n" +
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
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_cat\">Categories</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_cat\">\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-4\" ng-repeat=\"category in sw.categories\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(sw,category)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    {{category.name}}\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
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
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_effectDate\">Maintenance Effective Date</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.main_effect\"\n" +
    "                               maxlength=\"10\" id=\"{{sw.sid}}_effectDate\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_expDate\">Maintenance Expiration Date</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.main_exp\"\n" +
    "                               maxlength=\"10\" id=\"{{sw.sid}}_expDate\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_trf\">TRF</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"TRF number\" ng-model=\"sw.trf\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_trf\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_po\">PO</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"PO number\" ng-model=\"sw.po\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_po\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_numL\">Number of Licenses</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Number of Licenses\" ng-model=\"sw.num_licenses\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_numL\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_trfNotes\">TRF Notes</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"TRF notes\" ng-model=\"sw.trf_notes\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_trfNotes\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_lMode\">License Mode</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"sw.selMode\" ng-options=\"mode.name for mode in SWList.licenseModes\"\n" +
    "                                id=\"{{sw.sid}}_lMode\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_purDate\">Purchase Date</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.purch_date\"\n" +
    "                               maxlength=\"10\" id=\"{{sw.sid}}_purDate\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_vendorName\">Vendor Company Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Company Name\" ng-model=\"sw.vendor_name\"\n" +
    "                               maxlength=\"60\" id=\"{{sw.sid}}_vendorName\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_vendorContact\">Vendor Contact Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"sw.vendor_contact\"\n" +
    "                               maxlength=\"60\" id=\"{{sw.sid}}_vendorContact\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_vendorPhone\">Vendor Phone</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"sw.vendor_phone\"\n" +
    "                               maxlength=\"20\" id=\"{{sw.sid}}_vendorPhone\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_vendorEmail\">Vendor Email</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"sw.vendor_email\"\n" +
    "                               maxlength=\"255\" id=\"{{sw.sid}}_vendorEmail\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_prodKey\">Product Key</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Product Key\" ng-model=\"sw.pkey\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_prodKey\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_apDev\">Approved for Devices</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"List of Devices\" ng-model=\"sw.devices\"\n" +
    "                               maxlength=\"100\" id=\"{{sw.sid}}_apDev\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 form-group text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"unpublishSW(sw)\" ng-hide=\"sw.status == 0\">\n" +
    "                        Unpublish\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"copySW(sw)\">\n" +
    "                        Copy to New\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSW(sw)\">\n" +
    "                        Delete {{sw.title}} software\n" +
    "                    </button><br>\n" +
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
    "                       id=\"title\" maxlength=\"50\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"descr\">Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newSW.description\" maxlength=\"4096\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"mod\">List of Installed Modules</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"mod\" ng-model=\"newSW.modules\" maxlength=\"4096\"></textarea>\n" +
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
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\"\n" +
    "                                   ng-model=\"newSW.newLink.description\" maxlength=\"200\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\"\n" +
    "                                   ng-model=\"newSW.newLink.title\" maxlength=\"100\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\"\n" +
    "                                   ng-model=\"newSW.newLink.url\" maxlength=\"1024\">\n" +
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
    "                                    <div class=\"col-md-8\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWLoc(version,loc)\">\n" +
    "                                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                        </button>\n" +
    "                                        {{loc.name}}\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-4\">\n" +
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
    "                                </li>\n" +
    "                                <li class=\"list-group-item col-md-12\">\n" +
    "                                    <div class=\"col-md-8\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-3\">\n" +
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
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"newSW.newVer.version\"\n" +
    "                                   maxlength=\"50\">\n" +
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
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"cat\">Categories</label>\n" +
    "                <ul class=\"list-group\" id=\"cat\">\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-4\" ng-repeat=\"category in newSW.categories\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWCat(category)\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            {{category.name}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
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
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"effectDate\">Maintenance Effective Date</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"MM/DD/YYYY\" ng-model=\"newSW.main_effect\"\n" +
    "                       maxlength=\"10\" id=\"effectDate\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"expDate\">Maintenance Expiration Date</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"MM/DD/YYYY\" ng-model=\"newSW.main_exp\"\n" +
    "                       maxlength=\"10\" id=\"expDate\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"trf\">TRF</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"TRF number\" ng-model=\"newSW.trf\"\n" +
    "                       maxlength=\"100\" id=\"trf\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"po\">PO</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"PO number\" ng-model=\"newSW.po\"\n" +
    "                       maxlength=\"100\" id=\"po\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"numL\">Number of Licenses</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Number of Licenses\" ng-model=\"newSW.num_licenses\"\n" +
    "                       maxlength=\"100\" id=\"numL\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"trfNotes\">TRF Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"TRF notes\" ng-model=\"newSW.trf_notes\"\n" +
    "                       maxlength=\"100\" id=\"trfNotes\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"lMode\">License Mode</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newSW.selMode\" ng-options=\"mode.name for mode in SWList.licenseModes\"\n" +
    "                        id=\"lMode\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"purDate\">Purchase Date</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"newSW.purch_date\"\n" +
    "                       maxlength=\"10\" id=\"purDate\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"vendorName\">Vendor Company Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Company Name\" ng-model=\"newSW.vendor_name\"\n" +
    "                       maxlength=\"60\" id=\"vendorName\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"vendorContact\">Vendor Contact Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"newSW.vendor_contact\"\n" +
    "                       maxlength=\"60\" id=\"vendorContact\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"vendorPhone\">Vendor Phone</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"newSW.vendor_phone\"\n" +
    "                       maxlength=\"20\" id=\"vendorPhone\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"vendorEmail\">Vendor Email</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"newSW.vendor_email\"\n" +
    "                       maxlength=\"255\" id=\"vendorEmail\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"prodKey\">Product Key</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Product Key\" ng-model=\"newSW.pkey\"\n" +
    "                       maxlength=\"100\" id=\"prodKey\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"apDev\">Approved for Devices</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"List of Devices\" ng-model=\"newSW.devices\"\n" +
    "                       maxlength=\"100\" id=\"apDev\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 form-group text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Software Record</button><br>\n" +
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
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"newLocation.parent\"\n" +
    "                       maxlength=\"3\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-8\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"New Location Name\" ng-model=\"newLocation.name\"\n" +
    "                       maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation()\" ng-disabled=\"newLocation.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{locResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:50px;\">ID</th>\n" +
    "                <th style=\"width:75px;\">Parent</th>\n" +
    "                <th>Name</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"location in SWList.locations\" ng-click=\"selectLocation(location)\">\n" +
    "                <td>\n" +
    "                    {{location.lid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.parent}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"location.parent\"\n" +
    "                               maxlength=\"3\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"location.name\"\n" +
    "                               maxlength=\"50\">\n" +
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
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"New Category\" ng-model=\"newCategory\" maxlength=\"30\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory()\" ng-disabled=\"newCategory.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{catResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:50px;\">ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"category in SWList.categories\" ng-click=\"selectCategory(category)\">\n" +
    "                <td>\n" +
    "                    {{category.cid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selCategory == category.cid\">\n" +
    "                        {{category.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selCategory == category.cid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Category Name\" ng-model=\"category.name\"\n" +
    "                               maxlength=\"30\">\n" +
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
    "                    <th style=\"width:15%;\"><a ng-click=\"sortBy(0)\" style=\"cursor: pointer;\">Login</a></th>\n" +
    "                    <th style=\"width:15%;\" class=\"text-center\"><a ng-click=\"sortBy(1)\" style=\"cursor: pointer;\">Name</a></th>\n" +
    "                    <th class=\"text-center\">Access Rights to Web Applications</th>\n" +
    "                    <th class=\"text-center\" style=\"width:120px;\">Action</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tr ng-repeat=\"user in users | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse\" ng-click=\"expandUser(user)\">\n" +
    "                    <th scope=\"row\">\n" +
    "                        {{user.wpLogin}}\n" +
    "                    </th>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        {{user.name}}\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div ng-show=\"isExpUser(user.id)\">\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-md-2 text-right\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"user.access[$index]\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-hide=\"isExpUser(user.id)\" class=\"row text-center\">\n" +
    "                            <div class=\"col-md-3\" ng-repeat=\"app in apps\" ng-show=\"user.access[$index]\">\n" +
    "                                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div ng-show=\"isExpUser(user.id)\" class=\"form-group\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\">\n" +
    "                                <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                            </button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            <br>\n" +
    "                            {{result}}\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td colspan=\"2\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.fullName for user in wpUsers | orderBy:'name'\">\n" +
    "                        </select>\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                            <div class=\"col-md-2 text-right\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-10\">\n" +
    "                                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading || newUser.login.length <= 1\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span> Grant Access\n" +
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
    "            <span class=\"fa fa-fw fa-thumbs-o-down\" ng-show=\"record.score < 0\"></span>\n" +
    "            <span class=\"fa fa-fw fa-meh-o\" ng-show=\"record.score == 0\"></span>\n" +
    "            <span class=\"fa fa-fw fa-thumbs-o-up\" ng-show=\"record.score > 0\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.when}}\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.ip}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        {{record.comments}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectory.tpl.html",
    "<h2>Library Staff Directory Management</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div manage-sd-people>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div manage-sd-subjects>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 2\">\n" +
    "            <div manage-sd-departments>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectoryDepartments.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectoryDepartments.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Departments</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department Name\" ng-model=\"newDept.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <select class=\"form-control\" ng-model=\"newDept.selLib\" ng-options=\"lib.name for lib in Directory.libraries\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addDepartment()\" ng-disabled=\"newDept.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{depResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Department</th>\n" +
    "                <th>Location</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"dept in Directory.departments\" ng-click=\"expandDepartment(dept)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"dept.show\">{{dept.name}}</span>\n" +
    "                    <span ng-show=\"dept.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Department Name\" ng-model=\"dept.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"dept.show\">{{dept.selLib.name}}</span>\n" +
    "                    <span ng-show=\"dept.show\">\n" +
    "                        <select class=\"form-control\" ng-model=\"dept.selLib\" ng-options=\"lib.name for lib in Directory.libraries\">\n" +
    "                        </select>\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"dept.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editDepartment(dept)\" ng-disabled=\"dept.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDepartment(dept)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Libraries/Locations</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"newLoc.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLibrary()\" ng-disabled=\"newLoc.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{libResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Library/Location</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"lib in Directory.libraries\" ng-click=\"expandLibrary(lib)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"lib.show\">{{lib.name}}</span>\n" +
    "                    <span ng-show=\"lib.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Library Name\" ng-model=\"lib.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"lib.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editLibrary(lib)\" ng-disabled=\"lib.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLibrary(lib)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "\n" +
    "        <h3>Divisions</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Division Name\" ng-model=\"newDiv.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addDivision()\" ng-disabled=\"newDiv.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{divResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Division</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"division in Directory.divisions\" ng-click=\"expandDivision(division)\" ng-if=\"division.divid > 0\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"division.show\">{{division.name}}</span>\n" +
    "                    <span ng-show=\"division.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Division Name\" ng-model=\"division.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"division.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editDivision(division)\"\n" +
    "                                ng-disabled=\"division.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDivision(division)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectoryPeople.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectoryPeople.tpl.html",
    "<div>\n" +
    "    <h3>Add New Person</h3>\n" +
    "    <form ng-submit=\"addPerson()\">\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"rank\">Rank</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.rank\" ng-options=\"rank for rank in ranks\" id=\"rank\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"firstName\">First Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" maxlength=\"25\"\n" +
    "                       ng-model=\"newPerson.first\" id=\"firstName\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"lastName\">Last Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" maxlength=\"25\"\n" +
    "                       ng-model=\"newPerson.last\" id=\"lastName\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"150\"\n" +
    "                       ng-model=\"newPerson.title\" id=\"title\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"divis\">Division</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.selDiv\" ng-options=\"div.name for div in Directory.divisions\" id=\"divis\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"dept\">Department</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.selDept\" ng-options=\"dept.name for dept in Directory.departments\" id=\"dept\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"email\">Email</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Email\" maxlength=\"255\"\n" +
    "                       ng-model=\"newPerson.email\" id=\"email\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"phone\">Phone</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Phone\" maxlength=\"8\"\n" +
    "                       ng-model=\"newPerson.phone\" id=\"phone\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"fax\">Fax</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Fax\" maxlength=\"8\" ng-model=\"newPerson.fax\" id=\"fax\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\"\n" +
    "                        ng-disabled=\"newPerson.first.length < 1 ||\n" +
    "                                     newPerson.last.length < 1 ||\n" +
    "                                     newPerson.title.length < 1 ||\n" +
    "                                     newPerson.email.length < 1\">\n" +
    "                    Create New Record\n" +
    "                </button><br>\n" +
    "                {{formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>People List</h3>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredList.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last name contains\" ng-model=\"lastNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First name contains\" ng-model=\"firstNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department contains\" ng-model=\"deptFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table class=\"table table-condensed table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(0)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                        Name\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(1)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                        Title\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(2)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                        Department/Division\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:16%\">\n" +
    "                    Contact Info\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    Subjects\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"person in filteredList = (Directory.list\n" +
    "                                                        | filter:{lastname:lastNameFilter}\n" +
    "                                                        | filter:{firstname:firstNameFilter}\n" +
    "                                                        | filter:{title:titleFilter}\n" +
    "                                                        | filter:{department:deptFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "                                                        | startFrom:(currentPage-1)*perPage\n" +
    "                                                        | limitTo:perPage\">\n" +
    "                <td ng-click=\"togglePerson(person)\" style=\"cursor: pointer;\">\n" +
    "                    <h4>\n" +
    "                        <a>\n" +
    "                            <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"person.show\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-caret-down\" ng-show=\"person.show\"></span>\n" +
    "                            {{person.firstname}} {{person.lastname}}\n" +
    "                        </a>\n" +
    "                        <span ng-show=\"person.rank.length > 0\">\n" +
    "                            <small>{{person.rank}}</small>\n" +
    "                        </span>\n" +
    "                    </h4>\n" +
    "                    <img ng-src=\"{{person.photo}}\" width=\"180\" height=\"225\" ng-if=\"person.photo != null\" ng-show=\"person.show\">\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.title}}</small>\n" +
    "                    </h4>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.title}}\" maxlength=\"150\" ng-model=\"person.title\" required\n" +
    "                               id=\"{{person.id}}_title\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_rank\">Rank</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_rank\" ng-model=\"person.rank\"\n" +
    "                                ng-options=\"rank for rank in ranks\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_addSubj\">Select New Subject</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_addSubj\" ng-model=\"person.selSubj\"\n" +
    "                                ng-options=\"sub.subject for sub in Directory.subjects\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"text-center\" ng-show=\"person.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"updatePerson(person)\"\n" +
    "                                ng-disabled=\"person.first.length < 1 ||\n" +
    "                                             person.last.length < 1 ||\n" +
    "                                             person.title.length < 1 ||\n" +
    "                                             person.email.length < 1\">\n" +
    "                            Update information\n" +
    "                        </button><br>\n" +
    "                        {{person.subjResponse}}\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.department}}</small>\n" +
    "                    </h4>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.division}}</small>\n" +
    "                    </h4>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_dept\">Department</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_dept\" ng-model=\"person.selDept\"\n" +
    "                                ng-options=\"dept.name for dept in Directory.departments\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_divis\">Division</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_divis\" ng-model=\"person.selDiv\"\n" +
    "                                ng-options=\"div.name for div in Directory.divisions\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"row form-group\" ng-show=\"person.show\">\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <label for=\"{{person.id}}_addType\">Select Subject Type</label>\n" +
    "                            <select class=\"form-control\" id=\"{{person.id}}_addType\" ng-model=\"person.selType\"\n" +
    "                                    ng-options=\"type.name for type in subjectTypes\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <label>Add</label>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject(person)\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"text-center\" ng-show=\"person.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deletePerson(person)\">\n" +
    "                            Delete {{person.firstname}} {{person.lastname}}\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-envelope\"></span><small>{{person.email}}</small>\n" +
    "                    </div>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-phone\"></span><small>{{person.phone}}</small>\n" +
    "                    </div>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-fax\"></span><small>{{person.fax}}</small>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_email\">Email</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.email}}\" maxlength=\"1024\" ng-model=\"person.email\" required\n" +
    "                               id=\"{{person.id}}_email\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_phone\">Phone</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.phone}}\" maxlength=\"8\" ng-model=\"person.phone\" required\n" +
    "                               id=\"{{person.id}}_phone\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_fax\">Fax</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.fax}}\" maxlength=\"8\" ng-model=\"person.fax\"\n" +
    "                               id=\"{{person.id}}_fax\">\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-repeat=\"subject in person.subjects\" ng-hide=\"person.show\">\n" +
    "                        <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_subj\">Subjects</label>\n" +
    "                        <div id=\"{{person.id}}_subj\">\n" +
    "                            <div class=\"row form-group\" ng-repeat=\"subject in person.subjects\">\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(person, subject, $index)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <a href=\"{{subject.link}}\">{{subject.subject}}</a><br>\n" +
    "                                    <small>{{subjectTypes[subject.type - 1].name}}</small>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staffDirectory/staffDirectorySubjects.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectorySubjects.tpl.html",
    "<div>\n" +
    "    <h3>Manage Subjects</h3>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subject Name\" ng-model=\"newSubj.subject\"\n" +
    "                       maxlength=\"255\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://guides.lib.ua.edu/example\" ng-model=\"newSubj.link\"\n" +
    "                       maxlength=\"1024\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject()\" ng-disabled=\"newSubj.subject.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{subResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:41.6%;\">Subject</th>\n" +
    "                <th style=\"width:41.6%;\">Subject Link</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"subject in Directory.subjects\" ng-click=\"expandSubject(subject)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"subject.show\">{{subject.subject}}</span>\n" +
    "                    <span ng-show=\"subject.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Subject Name\" ng-model=\"subject.subject\"\n" +
    "                               maxlength=\"255\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"subject.show\">\n" +
    "                        <a href=\"{{subject.link}}\" ng-if=\"subject.link.length > 0\">{{subject.link}}</a>\n" +
    "                        <span ng-if=\"subject.link.length == 0\">{{subject.link}}</span>\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"subject.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Subject Link\" ng-model=\"subject.link\"\n" +
    "                               maxlength=\"1024\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"subject.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editSubject(subject)\" ng-disabled=\"subject.subject.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(subject)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
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
    "    <div class=\"row row-clickable\"\n" +
    "         ng-repeat=\"form in filteredForms = (data.forms | filter:{title:titleFilter}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: form.show}\">\n" +
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
