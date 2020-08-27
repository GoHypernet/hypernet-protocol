import {HypernetCore, IHypernetCore} from "@hypernetlabs/hypernet-core";


async function startup() {
    const core1 = new HypernetCore();
    let core2: IHypernetCore;
    const accounts = await core1.getAccounts();

    let useMultipleCores = accounts.length > 1;

    console.log(accounts);

    await core1.initialize(accounts[0]);

    if (useMultipleCores) {
        core2 = new HypernetCore();
        await core2.initialize(accounts[1]);
    }

    const links = await core1.getLinks();
    console.log(links);

    if (useMultipleCores) {
        const link = await core1.openLink(accounts[0], accounts[1], "asdfasdf", "dispute-mediator-public-key", null);
        console.log(link);
    }
    
}

startup().then(() => {
    alert("Startup complete!");
});