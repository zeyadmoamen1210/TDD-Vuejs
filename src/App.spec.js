import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import i18n from "@/locales";
import router from "@/routes";

describe("Routing", () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        plugins: [i18n, router],
      },
    });
  });

  // Start with testing the routes of components
  it.each`
    routeUrl     | testId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"}  | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
  `(
    "displays $testId component at $routeUrl url",
    async ({ routeUrl, testId }) => {
      await router.push(routeUrl);
      expect(wrapper.find(`[data-testid='${testId}']`).exists()).toBeTruthy();
    }
  );
  // End with testing the routes of components

  // Start testing the navbar routes
  it.each`
    link         | linkText     | pageTestId
    ${"/"}       | ${"Home"}    | ${"home-page"}
    ${"/signup"} | ${"Sign Up"} | ${"signup-page"}
    ${"/login"}  | ${"Login"}   | ${"login-page"}
    ${"/user/1"} | ${"User"}    | ${"user-page"}
  `(
    "link $link to exist in the navbar component",
    async ({ link, linkText, pageTestId }) => {
      expect(wrapper.text()).toContain(linkText);
      await router.push(link);
      expect(
        wrapper.find(`[data-testid='${pageTestId}']`).exists()
      ).toBeTruthy();
    }
  );
  // End testing the navbar routes
});
