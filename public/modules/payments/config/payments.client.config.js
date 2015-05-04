'use strict';

// Configuring the Payments module
angular.module('payments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Payments', 'payments', 'dropdown', '/payments(/create)?');
		Menus.addSubMenuItem('topbar', 'payments', 'List Payments', 'payments');
		Menus.addSubMenuItem('topbar', 'payments', 'New Payment', 'payments/create');
	}
]);