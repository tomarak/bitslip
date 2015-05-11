'use strict';

var directives = angular.module('directives');

directives.directive('autocomplete', ['$http', function($http) {
    return function (scope, element, attrs) {
        $(function(){
            $(element).autocomplete({
            minLength:3,
            source:function (request, response) {
                var url = '/search_user/?term=' + request.term;
                $http.get(url).success( function(data) {
                    for(var i=0; i< data.length; i++){
                        scope.validUsernames.push(data[i].username);
                    }
                    console.log(scope.validUsernames);
                    response(data);
                });
            },
            focus:function (event, ui) {
                element.val(ui.item.label);
                return false;
            },
            select:function (event, ui) {
                scope.recipient = ui.item.username;
                scope.$apply();
                return false;
            },
            change:function (event, ui) {
                if (ui.item === null) {
                    scope.recipient.selected = null;
                }
            }
          }).data('ui-autocomplete')._renderItem = function (ul, item) {
            return $('<li></li>')
                .data('item.autocomplete', item)
                .append('<a>' + item.username + '</a>')
                .appendTo(ul);
            };

        });
    };
}]);