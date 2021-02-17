import MediatorProxy from "@merchant-iframe/MediatorProxy";

// First step, get the mediator URL from the iframe params
const urlParams = new URLSearchParams(window.location.search);
const merchantUrl = urlParams.get("merchantUrl");

// Next, we will retrieve values from the mediator service's API, including the actual mediator code.

//const mediatorProxy = new MediatorProxy();
