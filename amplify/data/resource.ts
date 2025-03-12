import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Patient profile model
  Patient: a.model({
    firstName: a.string().required(),
    lastName: a.string().required(),
    dateOfBirth: a.string().required(),
    email: a.string().required(),
    phoneNumber: a.string(),
    address: a.string(),
    medicalHistory: a.string(),
  }).authorization(allow => [allow.owner()]),

  // Form response model
  FormResponse: a.model({
    patientID: a.string().required(),
    formType: a.string().required(),
    responses: a.json().required(),
    submittedAt: a.datetime().required(),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});