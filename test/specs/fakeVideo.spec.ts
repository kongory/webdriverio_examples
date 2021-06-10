describe("Fake video", async function () {
  it("Check that camera is visible", async function () {
    await browser.url("/");
    let joinButton = await $("#join-button");
    await expect(joinButton).toBeClickable({
      wait: 4000,
      message: "Expecter 'Join' button to be displayed",
    });
    await joinButton.click();
    await browser.pause(30000);
  });
});
