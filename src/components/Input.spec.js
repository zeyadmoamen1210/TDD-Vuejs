import Input from "./Input.vue";
import { mount } from "@vue/test-utils";

describe("Input.vue", () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(Input, {
      props: {
        help: "must be more than 10 characters long",
      },
    });
  });

  it("has is-invalid class on the input if help is set", async () => {
    const input = wrapper.get("input");
    expect(input.classes()).toContain("is-invalid");
  });

  it("has a invalid-feedback class if help is set", () => {
    expect(wrapper.find(".invalid-feedback").exists()).toBeTruthy();
  });

  it("does not have is-invalid class when help is not set", () => {
    wrapper = mount(Input, {
      props: {},
    });
    const input = wrapper.get("input");
    expect(input.classes()).not.toContain("is-invalid");
  });
});
