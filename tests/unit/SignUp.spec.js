import { mount, flushPromises } from "@vue/test-utils";
import SignUp from "@/pages/SignUp.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import axios from "axios";
import i18n from "@/locales";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import FlagsComponent from "@/components/Flags.vue";

let reqBody = null;
let acceptLangHeader = null;
let counter = 0;
let server = setupServer(
  rest.post("/api/1.0/users", async (req, res, ctx) => {
    reqBody = await req.json();
    acceptLangHeader = req.headers.get("Accept-Language");
    counter++;
    return res(ctx.status(200));
  })
);
beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});
beforeAll(() => {
  server.listen();
});
afterAll(() => server.close());

describe("SignUp.vue", () => {
  let wrapper = null;
  let header = null;
  let password = null;
  let passwordConfirmation = null;
  let signUpButton = null;
  let username = null;
  let email = null;
  beforeEach(() => {
    const app = {
      components: {
        SignUp,
        Flags: FlagsComponent,
      },
      template: `
        <SignUp />
        <Flags />
      `,
    };

    wrapper = mount(app, {
      global: {
        plugins: [i18n],
        mocks: {
          $axios: axios,
          $i18n: i18n,
        },
      },
    });

    header = wrapper.get("#header");
    password = wrapper.find("#password");
    passwordConfirmation = wrapper.find("#password_confirmation");
    signUpButton = wrapper.find("#signup");
    username = wrapper.find("#username");
    email = wrapper.find("#email");
  });

  function generalValidationErrors(field, message) {
    return rest.post("/api/1.0/users", (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({
          validationErrors: {
            [field]: message,
          },
        })
      );
    });
  }

  // Layout tests
  describe("Layout", () => {
    it("has a signup header text", () => {
      expect(wrapper.find("#header").exists()).toBeTruthy();
      expect(header.text()).toBe("Sign Up");
    });
    it("has an username input", () => {
      expect(wrapper.find("#username").exists()).toBeTruthy();
    });
    it("has an email input", () => {
      expect(wrapper.find("#email").exists()).toBeTruthy();
    });
    it("has an password input and the input type is password", () => {
      expect(password.exists()).toBeTruthy();
      expect(password.element.getAttribute("type")).toBe("password");
    });

    it("has an confirmation password input and the input type is password", async () => {
      expect(passwordConfirmation.exists()).toBeTruthy();
      expect(passwordConfirmation.element.getAttribute("type")).toBe(
        "password"
      );
    });

    it("has signup button", () => {
      expect(signUpButton.exists()).toBeTruthy();
    });

    it("signup is disabled by default", () => {
      expect(signUpButton.attributes("disabled")).toBe("");
    });
  });

  const fillFormInputs = async () => {
    await username.setValue("user1");
    await email.setValue("sasasas@gmail.com");
    await password.setValue("zzzZZZ123");
    await passwordConfirmation.setValue("zzzZZZ123");
  };

  // integrations
  describe("integrations", () => {
    it("enable the button when the password and password confirmation are filled", async () => {
      await password.setValue("p4ssword");
      await passwordConfirmation.setValue("p4ssword");
      expect(signUpButton.attributes("disabled")).toBe(undefined);
    });
    it("send username and email to the backend after clicking the button", async () => {
      await fillFormInputs();

      await signUpButton.trigger("click");

      expect(reqBody).toEqual({
        username: "user1",
        email: "sasasas@gmail.com",
        password: "zzzZZZ123",
        password_confirmation: "zzzZZZ123",
      });
    });

    it("cant be click to the button again if the request api call ongoing", async () => {
      await fillFormInputs();
      await signUpButton.trigger("click");
      await signUpButton.trigger("click");
      await signUpButton.trigger("click");
      expect(counter).toBe(1);
    });

    it("the signup button should contain spinner during the request", async () => {
      await fillFormInputs();
      await signUpButton.trigger("click");
      expect(wrapper.find("[data-signup='spinner']").exists()).toBeTruthy();
    });

    it("not show the spinner when no requests is ongoing", () => {
      expect(wrapper.find("[data-signup='spinner']").exists()).not.toBeTruthy();
    });

    it("show activation message when request is succeed", async () => {
      await fillFormInputs();
      await signUpButton.trigger("click");

      // Wait for the activation message element to render
      // await new Promise((resolve) => setTimeout(resolve, 0));
      await flushPromises();
      const ele = wrapper.find("#active-msg").exists();
      expect(ele).toBeTruthy();
    });
    it("it does not render the acctivation message before signup", async () => {
      expect(wrapper.find("#active-msg").exists()).toBeFalsy();
    });

    it("does not render acctivation message after failing request", async () => {
      server.use(generalValidationErrors("username", "user cannot be null"));
      await fillFormInputs();
      await signUpButton.trigger("click");
      await flushPromises();
      expect(wrapper.find("#active-msg").exists()).toBeFalsy();
    });

    it("Hide sign up form after successful signup request", async () => {
      await fillFormInputs();
      await signUpButton.trigger("click");
      await flushPromises();
      expect(wrapper.find("#signup-form").exists()).toBeFalsy();
    });

    it.each`
      field                      | message
      ${"username"}              | ${"user cannot be null"}
      ${"email"}                 | ${"email cannot be null"}
      ${"password_confirmation"} | ${"password confirmation cannot be null"}
    `("display $message for $field ", async ({ field, message }) => {
      server.use(generalValidationErrors(field, message));
      await username.setValue("u");
      await password.setValue("myPas4work");
      await passwordConfirmation.setValue("myPas4work");
      await signUpButton.trigger("click");
      await flushPromises();
      expect(wrapper.text()).toContain(message);
    });

    it("remove the spinner after the request failed", async () => {
      server.use(generalValidationErrors("username", "user cannot be null"));
      await username.setValue("vc");
      await password.setValue("vc");
      await passwordConfirmation.setValue("vc");
      await signUpButton.trigger("click");
      await flushPromises();
      expect(wrapper.find(".spinner-border").exists()).toBeFalsy();
    });

    it("displays an error message if the password and password confirmation mismatchs", async () => {
      await password.setValue("pasS1");
      await passwordConfirmation.setValue("pasS2");
      expect(wrapper.text()).toContain(en.passwordMisMatch);
    });

    it.each`
      field                      | message                                   | id
      ${"username"}              | ${"user cannot be null"}                  | ${"username"}
      ${"email"}                 | ${"email cannot be null"}                 | ${"email"}
      ${"password"}              | ${"password cannot be null"}              | ${"password"}
      ${"password_confirmation"} | ${"password_confirmation cannot be null"} | ${"password_confirmation"}
    `(
      "do not display the $field error when user start fill the input",
      async ({ field, message, id }) => {
        server.use(generalValidationErrors(field, message, id));
        await fillFormInputs();
        await signUpButton.trigger("click");
        await flushPromises();

        const ele = wrapper.find(`#${id}`);
        await ele.setValue("updated");
        expect(wrapper.text()).not.toContain(message);
      }
    );
  });

  describe("Localization", () => {
    it("render the english locals initially", () => {
      expect(wrapper.text()).toContain(en.signup);
      expect(wrapper.text()).toContain(en.username);
      expect(wrapper.text()).toContain(en.email);
      expect(wrapper.text()).toContain(en.password);
      expect(wrapper.text()).toContain(en.passwordConfirmation);
    });

    it("render all arabic language after selecting language", async () => {
      const langIcon = wrapper.find(`#locale-ar`);
      await langIcon.trigger("click");
      expect(wrapper.text()).toContain(ar.signup);
      expect(wrapper.text()).toContain(ar.username);
      expect(wrapper.text()).toContain(ar.email);
      expect(wrapper.text()).toContain(ar.password);
      expect(wrapper.text()).toContain(ar.passwordConfirmation);
    });

    it("render password mismatch message in arabic when arabic is selected", async () => {
      const langIcon = wrapper.find(`#locale-ar`);
      await langIcon.trigger("click");

      await password.setValue("P4assword");
      await passwordConfirmation.setValue("n3wPass");
      expect(wrapper.text()).toContain(ar.passwordMisMatch);
    });

    it("sends accept-language having en to backend for sign up request", async () => {
      await fillFormInputs();
      await signUpButton.trigger("click");
      expect(acceptLangHeader).toBe("en");
    });

    it("sends accept-language having ar after that language is selected to backend for sign up request", async () => {
      const langIcon = wrapper.find(`#locale-ar`);
      await langIcon.trigger("click");

      await fillFormInputs();
      await signUpButton.trigger("click");
      expect(acceptLangHeader).toBe("ar");
    });
  });
});
