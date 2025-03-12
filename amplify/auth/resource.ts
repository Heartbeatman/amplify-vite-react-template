import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure patient authentication resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: false,
    username: false
  },
  userAttributes: {
    // Add required attributes for patients
    given_name: {
      required: true,
      mutable: true,
    },
    family_name: {
      required: true,
      mutable: true,
    },
    birthdate: {
      required: true,
      mutable: true,
    },
  },

  // Set password policy
  passwordPolicy: {
    minimumLength: 8,
    requireNumbers: true,
    requireSpecialCharacters: true,
    requireUppercase: true,
    requireLowercase: true,
  }
});