'use strict';

(function() {
	// Payments Controller Spec
	describe('PaymentsController', function() {
		// Initialize global variables
		var PaymentsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Payments controller.
			PaymentsController = $controller('PaymentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one payment object fetched from XHR', inject(function(Payments) {
			// Create sample payment using the Payments service
			var samplePayment = new Payments({
				message: "here's your coin, peasant",
				amount: 38747
			});

			// Create a sample Payments array that includes the new Payment
			var samplePayments = [samplePayment];

			// Set GET response
			$httpBackend.expectGET('payments').respond(samplePayments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.payments).toEqualData(samplePayments);
		}));

		it('$scope.findOne() should create an array with one payment object fetched from XHR using a PaymentId URL parameter', inject(function(Payments) {
			// Define a sample payment object
			var samplePayment = new Payments({
				message: "here's your coin, peasant",
				amount: 38747
			});

			// Set the URL parameter
			$stateParams.paymentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/payments\/([0-9a-fA-F]{24})$/).respond(samplePayment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.payment).toEqualData(samplePayment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Payments) {
			// Create a sample payment object
			var samplePaymentPostData = new Payments({
				message: "here's your coin, peasant",
				amount: 38747
			});

			// Create a sample payment response
			var samplePaymentResponse = new Payments({
				_id: '525cf20451979dea2c000001',
				message: "here's your coin, peasant",
				amount: 38747
			});

			// Fixture mock form input values
			scope.message = "here's your coin, peasant";
			scope.amount = 38747;

			// Set POST response
			$httpBackend.expectPOST('payments', samplePaymentPostData).respond(samplePaymentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.message).toEqual('');
			expect(scope.amount).toEqual('');

			// Test URL redirection after the payment was created
			expect($location.path()).toBe('/payments/' + samplePaymentResponse._id);
		}));
	});
}());