import { multiremote } from "webdriverio";

describe("Test multiple browser", function () {
  let browserUserA: WebdriverIO.Browser;
  let browserUserB: WebdriverIO.Browser;
  let remoteBrowser: MultiRemoteBrowserAsync;

  before(async function () {
    if (process.env.CI == "true") {
      remoteBrowser = await multiremote({
        userA: {
          hostname: "localhost",
          path: "/wd/hub",
          capabilities: {
            browserName: "chrome",
            "goog:chromeOptions": {
              args: [
                "--window-size=1920,1080",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
              ],
            },
          },
        },
        userB: {
          hostname: "localhost",
          path: "/wd/hub",
          capabilities: {
            browserName: "chrome",
            "goog:chromeOptions": {
              args: [
                "--window-size=1920,1080",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
              ],
            },
          },
        },
      });
    } else {
      remoteBrowser = await multiremote({
        userA: {
          capabilities: {
            browserName: "chrome",
            "goog:chromeOptions": {
              args: [
                "--window-size=1920,1080",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
              ],
            },
          },
        },
        userB: {
          capabilities: {
            browserName: "chrome",
            "goog:chromeOptions": {
              args: [
                "--window-size=1920,1080",
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
              ],
            },
          },
        },
      });
    }

    browserUserA = remoteBrowser["userA"];
    browserUserB = remoteBrowser["userB"];
  });

  after(async function () {
    await browserUserA.deleteSession();
    await browserUserB.deleteSession();
  });

  it("Check different sites using two browsers", async function () {
    await browserUserA.url("https://github.com");
    const marketplace = await browserUserA.$(
      "//a[normalize-space()='Marketplace']"
    );
    await marketplace.waitForDisplayed({
      timeout: 8000,
      timeoutMsg: "'Marketplace' menu isn't displayed",
    });
    await marketplace.click();
    const exploreFreeApps = await browserUserA.$(
      "//a[normalize-space()='Explore free apps']"
    );
    await exploreFreeApps.waitForDisplayed({
      timeout: 8000,
      timeoutMsg: "'Explore free apps' link isn't clickable",
    });
    await exploreFreeApps.click();
    const title = await browserUserA.$("h1=Free");
    await title.waitForDisplayed({ timeout: 8000 });

    await browserUserB.url("https://google.com");
    const searchInput = await browserUserB.$("input[name='q']");
    await searchInput.waitForDisplayed({
      timeout: 4000,
      timeoutMsg: "'Search' input isn't displayed",
    });
    await searchInput.setValue("webdriverio");
    await searchInput.keys(["Enter"]);
  });
});
