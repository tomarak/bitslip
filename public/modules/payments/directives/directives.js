var directives = angular.module('directives');

directives.directive('autocomplete', ['$http', function($http) {
    return function (scope, element, attrs) {
        element.autocomplete({
            minLength:3,
            source:function (request, response) {
                var url = "/search_user" + request.term;
                $http.get(url).success( function(data) {
                    response(data.results);
                });
            },
            focus:function (event, ui) {
                element.val(ui.item.label);
                return false;
            },
            select:function (event, ui) {
                scope.myModelId.selected = ui.item.value;
                scope.$apply;
                return false;
            },
            change:function (event, ui) {
                if (ui.item === null) {
                    scope.myModelId.selected = null;
                }
            }
        }).data("autocomplete")._renderItem = function (ul, item) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a>" + item.label + "</a>")
                .appendTo(ul);
        };
    }
}]);