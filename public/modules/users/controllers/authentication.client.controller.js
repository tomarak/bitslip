'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Super hacky way to redirect to new url, will replace later with angular redirect
				window.location.replace('https://sandbox.coinbase.com/sessions/oauth_signin?client_id=b6372a73732cd26fd06163b4a1ae66a390a4a8793131db27600e4f11568aac9b&meta%5Bsend_limit_amount%5D=50&redirect_uri=https://bitslip.herokuapp.com/cbredirect&response_type=code&scope=balance+send+transactions+user+reports');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);