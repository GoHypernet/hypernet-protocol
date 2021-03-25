Feature: PushPayments
	Tests if user is able to create push payments

	Scenario: PushPaymentUserA can create push payment and send funds to PushPaymentUserB
		Given counterPartyUser of public identifier 'vector7cj246GhtigBXCVJ2ypwHHU9KcnPqzYJ7eTwwet4Fi8S8VPH17' has hypernet account has the developer UI opened
		Given PushPaymentUserA has hypernet account has the developer UI opened
		Given PushPaymentUserA has funded his wallet with '1' ETH
		Given PushPaymentUserA authorize merchant url of 'http://localhost:5010'
		When PushPaymentUserA initiate push payment with public identifier of 'vector7cj246GhtigBXCVJ2ypwHHU9KcnPqzYJ7eTwwet4Fi8S8VPH17', Required Stake of '1', token selector of 'ETH', amount of '1', merchant url of 'http://localhost:5010' and click submit payment
		Then PushPaymentUserA has a push payment payment with status 'Proposed', amount of '1' and required stake amount of '1' sent to counter party with address of 'vector7cj246GhtigBXCVJ2ypwHHU9KcnPqzYJ7eTwwet4Fi8S8VPH17'