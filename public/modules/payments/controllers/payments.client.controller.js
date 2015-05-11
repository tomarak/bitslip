'use strict';

angular.module('payments').controller('PaymentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Payments', 'Users',
	function($scope, $stateParams, $location, Authentication, Payments, Users) {
		$scope.authentication = Authentication;
 	
		$scope.create = function() {
			var payment = new Payments({
				amount: this.amount,
				message: this.message,
				recipient: this.recipient
			});
			payment.$save(function(response) {
				$location.path('payments/' + response._id);

				$scope.amount = 0;
				$scope.message = '';
				$scope.recipient = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.validUsernames = [];

		$scope.validateUsername = function(){
			if($scope.validUsernames.indexOf($scope.recipient) > -1){
				return true;
			} else {
				return false;
			}
		}

		$scope.find = function() {
			$scope.payments = Payments.query();
		};

		$scope.findOne = function() {
			$scope.payment = Payments.get({
				paymentId: $stateParams.paymentId
			});
		};
	}
]);