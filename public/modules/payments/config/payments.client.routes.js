'use strict';

// Setting up route
angular.module('payments').config(['$stateProvider',
	function($stateProvider) {
		// Payments state routing
		$stateProvider.
		state('listPayments', {
			url: '/payments',
			templateUrl: 'modules/payments/views/list-payments.client.view.html'
		}).
		state('createPayment', {
			url: '/payments/create',
			templateUrl: 'modules/payments/views/create-payment.client.view.html'
		}).
		state('viewPayment'
			, {
			url: '/payments/:paymentId',
			templateUrl: 'modules/payments/views/view-payment.client.view.html'
		}).
		state('editPayment', {
			url: '/payments/:paymentId/edit',
			templateUrl: 'modules/payments/views/edit-payment.client.view.html'
		});
	}
]);