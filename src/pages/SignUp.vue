<template>
  <div class="container" data-testid="signup-page">
    <div class="col-lg-6 offset-lg-3">
      <div v-if="signUpSucceed" id="active-msg" class="alert alert-success">
        {{ $t("success please check you activation message") }}
      </div>

      <form v-else @submit.prevent class="card mt-5 p-3 signup-form">
        <div class="card-header mb-2">
          <h3 id="header">{{ $t("signup") }}</h3>
        </div>
        <div class="card-body">
          <div class="form-group mb-2">
            <Input
              :label="$t('username')"
              :id="`username`"
              :help="validationMsgs.username"
              v-model="form.username"
            />
          </div>
          <div class="form-group mb-2">
            <Input
              :label="$t('email')"
              :id="`email`"
              :type="`email`"
              :help="validationMsgs.email"
              v-model="form.email"
            />
          </div>
          <div class="form-group mb-2">
            <Input
              :label="$t('password')"
              :id="`password`"
              :type="`password`"
              :help="validationMsgs.password"
              v-model="form.password"
            />
          </div>
          <div class="form-group mb-2">
            <Input
              :label="$t('passwordConfirmation')"
              :id="`password_confirmation`"
              :type="`password`"
              :help="
                passwordsMismatch
                  ? $t('passwordMisMatch')
                  : validationMsgs.password_confirmation
              "
              v-model="form.password_confirmation"
            />
          </div>
          <div>
            <button
              class="btn btn-primary"
              id="signup"
              @click="submitSignupForm"
              :disabled="isDisabled() || signUpFormLoading"
            >
              <span
                v-if="signUpFormLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                data-signup="spinner"
              ></span>
              {{ $t("signup") }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Input from "@/components/Input.vue";
import { signUp } from "@/api/apiCalls";

export default {
  components: {
    Input,
  },
  computed: {
    passwordsMismatch() {
      return this.form.password !== this.form.password_confirmation;
    },
  },
  data() {
    return {
      form: {},
      signUpFormLoading: false,
      signUpSucceed: false,
      validationMsgs: {},
    };
  },
  watch: {
    "form.username"() {
      delete this.validationMsgs.username;
    },
    "form.email"() {
      delete this.validationMsgs.email;
    },
    "form.password"() {
      delete this.validationMsgs.password;
    },
    "form.password_confirmation"() {
      delete this.validationMsgs.password_confirmation;
    },
  },
  methods: {
    async submitSignupForm() {
      this.signUpFormLoading = true;
      try {
        await signUp(this.form);
        this.signUpSucceed = true;
      } catch (error) {
        this.validationMsgs = error.response?.data?.validationErrors;
      } finally {
        this.signUpFormLoading = false;
      }
    },
    isDisabled() {
      let isValid = true;
      isValid = isValid && this.form.password;
      isValid = isValid && this.form.password_confirmation;
      if (isValid) {
        isValid = this.form.password === this.form.password_confirmation;
      }
      return isValid ? false : true;
    },
  },
};
</script>

<style></style>
