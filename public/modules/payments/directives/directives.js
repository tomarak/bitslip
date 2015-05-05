var directives = angular.module('directives');

directives.directive('autocomplete', ['$http', function($http) {
    return function (scope, element, attrs) {
        console.log("element", element);
        console.log("attrs", attrs);
        console.log(scope, "scope");

        $(function(){
            $(element).autocomplete({
            minLength:3,
            source:function (request, response) {
                var url = "/search_user/?term=" + request.term;
                $http.get(url).success( function(data) {
                    var list = data[0].username;
                    console.log("list", list)
                    console.log("response", response)
                    response(data);
                });
            },
            focus:function (event, ui) {
                element.val(ui.item.label);
                return false;
            },
            select:function (event, ui) {
                console.log(scope, "scopere")
                scope.recipient = ui.item.username;
                console.log("ui", ui.item);
                scope.$apply();
                return false;
            },
            change:function (event, ui) {
                if (ui.item === null) {
                    scope.recipient.selected = null;
                }
            }
          }).data('ui-autocomplete')._renderItem = function (ul, item) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a>" + item.username + "</a>")
                .appendTo(ul);
            };
        })
    }
}]);