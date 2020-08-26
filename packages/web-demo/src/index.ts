import {HypernetCore} from "@hypernetlabs/hypernet-core";


async function startup() {
    const core1 = new HypernetCore();
    const core2 = new HypernetCore();

    await core1.initialize("asdfa");
    await core2.initialize("asdf");
}

startup().then(() => {
    alert("Startup complete!");
});