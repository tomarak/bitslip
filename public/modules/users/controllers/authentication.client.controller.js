'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$window', 'Authentication',
	function($scope, $http, $location, $window, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		// Short circuit to prevent console errors
		if ($scope.authentication && $scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// redirect to access token process
				$window.location.href='https://sandbox.coinbase.com/sessions/oauth_signin?client_id=b6372a73732cd26fd06163b4a1ae66a390a4a8793131db27600e4f11568aac9b&meta%5Bsend_limit_amount%5D=50&redirect_uri=https://bitslip.herokuapp.com/cbredirect&response_type=code&scope=balance+send+transactions+user+reports';
				// $location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// redirect to access token process
				$window.location.href='https://sandbox.coinbase.com/sessions/oauth_signin?client_id=b6372a73732cd26fd06163b4a1ae66a390a4a8793131db27600e4f11568aac9b&meta%5Bsend_limit_amount%5D=50&redirect_uri=https://bitslip.herokuapp.com/cbredirect&response_type=code&scope=balance+send+transactions+user+reports';
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);