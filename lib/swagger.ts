import { createSwaggerSpec } from "next-swagger-doc";

import {
  enumGender,
  maxPassword,
  maxUsername,
  minPassword,
  minUsername,
  patternSsn,
  patternUsername,
} from "./schema";

/* eslint-disable @typescript-eslint/naming-convention */
export const spec = createSwaggerSpec({
  apiFolder: "src/app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next Swagger API Example",
      version: "1.0",
    },
    paths: {
      "/api/hello": {
        get: {
          tags: ["Hello"],
          summary: "Hello world",
          responses: {
            "200": {
              description: "Hello world",
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hello world",
                  },
                },
              },
            },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["User"],
          summary: "Get all users",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["User"],
          summary: "Get a user by id",
          parameters: [{ $ref: "#/components/parameters/userId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/admins": {
        get: {
          tags: ["Admin"],
          summary: "Get all admins",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Admin"],
          summary: "Create a new admin",
          requestBody: { $ref: "#/components/requestBodies/Admin" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/admins/{user-id}": {
        get: {
          tags: ["Admin"],
          summary: "Get an admin by user id",
          parameters: [{ $ref: "#/components/parameters/adminId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Admin"],
          summary: "Update an admin by user id",
          parameters: [{ $ref: "#/components/parameters/adminId" }],
          requestBody: { $ref: "#/components/requestBodies/Admin" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Admin"],
          summary: "Delete an admin by user id",
          parameters: [{ $ref: "#/components/parameters/adminId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/doctors": {
        get: {
          tags: ["Doctor"],
          summary: "Get all doctors",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Doctor"],
          summary: "Create a new doctor",
          requestBody: { $ref: "#/components/requestBodies/Doctor" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/doctors/{user-id}": {
        get: {
          tags: ["Doctor"],
          summary: "Get a doctor by user id",
          parameters: [{ $ref: "#/components/parameters/doctorId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Doctor"],
          summary: "Update a doctor by user id",
          parameters: [{ $ref: "#/components/parameters/doctorId" }],
          requestBody: { $ref: "#/components/requestBodies/Doctor" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Doctor"],
          summary: "Delete a doctor by user id",
          parameters: [{ $ref: "#/components/parameters/doctorId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients": {
        get: {
          tags: ["Patient"],
          summary: "Get all patients",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Patient"],
          summary: "Create a new patient",
          requestBody: { $ref: "#/components/requestBodies/Patient" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients/{user-id}": {
        get: {
          tags: ["Patient"],
          summary: "Get a patient by user id",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Patient"],
          summary: "Update a patient by user id",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          requestBody: { $ref: "#/components/requestBodies/Patient" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Patient"],
          summary: "Delete a patient by user id",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients/{user-id}/medical-conditions": {
        get: {
          tags: ["Patient"],
          summary: "Get a patient's medical conditions",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Patient"],
          summary: "Add a patient's medical condition",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          requestBody: {
            $ref: "#/components/requestBodies/AddPatientMedicalCondition",
          },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients/{user-id}/medical-conditions/{id}": {
        delete: {
          tags: ["Patient"],
          summary: "Remove a patient's medical condition",
          parameters: [
            { $ref: "#/components/parameters/patientId" },
            { $ref: "#/components/parameters/medicalConditionId" },
          ],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotics": {
        get: {
          tags: ["Probiotic"],
          summary: "Get all probiotics",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotics/{id}": {
        get: {
          tags: ["Probiotic"],
          summary: "Get a probiotic by id",
          parameters: [{ $ref: "#/components/parameters/probioticId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
    },
    components: {
      // securitySchemes: {
      //   BearerAuth: {
      //     type: "http",
      //     scheme: "bearer",
      //     bearerFormat: "JWT",
      //   },
      // },
      parameters: {
        userId: {
          name: "id",
          in: "path",
          description: "The id of the user",
          required: true,
          type: "string",
        },
        adminId: {
          name: "user-id",
          in: "path",
          description: "The user id of the admin",
          required: true,
          type: "string",
        },
        doctorId: {
          name: "user-id",
          in: "path",
          description: "The user id of the doctor",
          required: true,
          type: "string",
        },
        patientId: {
          name: "user-id",
          in: "path",
          description: "The user id of the patient",
          required: true,
          type: "string",
        },
        probioticId: {
          name: "id",
          in: "path",
          description: "The id of the probiotic",
          required: true,
          type: "integer",
        },
        medicalConditionId: {
          name: "id",
          in: "path",
          description: "The id of the medical condition",
          required: true,
          type: "integer",
        },
      },
      requestBodies: {
        Admin: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "The username of the admin",
                    minLength: minUsername,
                    maxLength: maxUsername,
                    pattern: patternUsername,
                  },
                  password: {
                    type: "string",
                    description: "The password of the admin",
                    minLength: minPassword,
                    maxLength: maxPassword,
                  },
                  email: {
                    type: "string",
                    description: "The email address of the admin (optional)",
                    format: "email",
                  },
                  prefix: {
                    type: "string",
                    description: "The prefix of the admin's name",
                    minLength: 1,
                  },
                  firstName: {
                    type: "string",
                    description: "The first name of the admin",
                    minLength: 1,
                  },
                  lastName: {
                    type: "string",
                    description: "The last name of the admin",
                    minLength: 1,
                  },
                },
              },
            },
          },
        },
        Doctor: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "The username of the doctor",
                    minLength: minUsername,
                    maxLength: maxUsername,
                    pattern: patternUsername,
                  },
                  password: {
                    type: "string",
                    description: "The password of the doctor",
                    minLength: minPassword,
                    maxLength: maxPassword,
                  },
                  email: {
                    type: "string",
                    description: "The email address of the doctor (optional)",
                    format: "email",
                  },
                  prefix: {
                    type: "string",
                    description: "The prefix of the doctor's name",
                    minLength: 1,
                  },
                  firstName: {
                    type: "string",
                    description: "The first name of the doctor",
                    minLength: 1,
                  },
                  lastName: {
                    type: "string",
                    description: "The last name of the doctor",
                    minLength: 1,
                  },
                },
              },
            },
          },
        },
        Patient: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "The username of the patient",
                    minLength: minUsername,
                    maxLength: maxUsername,
                    pattern: patternUsername,
                  },
                  password: {
                    type: "string",
                    description: "The password of the patient",
                    minLength: minPassword,
                    maxLength: maxPassword,
                  },
                  email: {
                    type: "string",
                    description: "The email address of the patient (optional)",
                    format: "email",
                  },
                  prefix: {
                    type: "string",
                    description: "The prefix of the patient's name",
                    minLength: 1,
                  },
                  firstName: {
                    type: "string",
                    description: "The first name of the patient",
                    minLength: 1,
                  },
                  lastName: {
                    type: "string",
                    description: "The last name of the patient",
                    minLength: 1,
                  },
                  ssn: {
                    type: "string",
                    description: "The last name of the patient",
                    minLength: 1,
                    maxLength: 16,
                    pattern: patternSsn,
                  },
                  gender: {
                    type: "string",
                    enum: enumGender,
                    description: "The last name of the patient",
                    minLength: 1,
                  },
                  birthDate: {
                    type: "string",
                    description: "The last name of the patient",
                    minLength: 1,
                    format: "date-time",
                  },
                  ethnicity: {
                    type: "string",
                    description: "The last name of the patient",
                    minLength: 1,
                  },
                },
              },
            },
          },
        },
        AddPatientMedicalCondition: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  medicalConditionId: {
                    type: "integer",
                    description:
                      "The unique identifier of the medical condition",
                  },
                },
              },
            },
          },
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "The type of the user",
            },
            id: {
              type: "string",
              description: "The unique identifier of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              nullable: true,
              description: "The email address of the user",
            },
            prefix: {
              type: "string",
              description: "The prefix of the user's name",
            },
            firstName: {
              type: "string",
              description: "The first name of the user",
            },
            lastName: {
              type: "string",
              description: "The last name of the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was last updated",
            },
          },
        },
        Admin: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "The type of the user",
            },
            id: {
              type: "string",
              description: "The unique identifier of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              nullable: true,
              description: "The email address of the user",
            },
            prefix: {
              type: "string",
              description: "The prefix of the user's name",
            },
            firstName: {
              type: "string",
              description: "The first name of the user",
            },
            lastName: {
              type: "string",
              description: "The last name of the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was last updated",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "The type of the user",
            },
            id: {
              type: "string",
              description: "The unique identifier of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              nullable: true,
              description: "The email address of the user",
            },
            prefix: {
              type: "string",
              description: "The prefix of the user's name",
            },
            firstName: {
              type: "string",
              description: "The first name of the user",
            },
            lastName: {
              type: "string",
              description: "The last name of the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was last updated",
            },
          },
        },
        Patient: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "The type of the user",
            },
            id: {
              type: "string",
              description: "The unique identifier of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              nullable: true,
              description: "The email address of the user",
            },
            prefix: {
              type: "string",
              description: "The prefix of the user's name",
            },
            firstName: {
              type: "string",
              description: "The first name of the user",
            },
            lastName: {
              type: "string",
              description: "The last name of the user",
            },
            ssn: {
              type: "string",
              description: "The social security number of the patient",
              pattern: patternSsn,
            },
            gender: {
              type: "string",
              description: "The gender of the patient",
              enum: ["Male", "Female", "Others"],
            },
            birthDate: {
              type: "string",
              format: "date",
              description: "The date of birth of the patient",
            },
            ethnicity: {
              type: "string",
              nullable: true,
              description: "The ethnicity of the patient",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was last updated",
            },
          },
        },
        File: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the file",
            },
            uri: {
              type: "string",
              description: "The URI of the file",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the file was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the file was last updated",
            },
          },
        },
        Probiotic: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The unique identifier of the probiotic",
            },
            parentId: {
              type: "integer",
              nullable: true,
              description:
                "The unique identifier of the parent probiotic (if applicable)",
            },
            name: {
              type: "string",
              description: "The name of the probiotic",
              minLength: 1,
            },
            red: {
              type: "number",
              description: "The red threshold for probiotic results",
              minimum: 0,
            },
            yellow: {
              type: "number",
              description: "The yellow threshold for probiotic results",
              minimum: 0,
            },
            green: {
              type: "number",
              description: "The green threshold for probiotic results",
              minimum: 0,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic was last updated",
            },
          },
        },
        ProbioticBrand: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The unique identifier of the probiotic brand",
            },
            name: {
              type: "string",
              description: "The name of the probiotic brand",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic brand was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the probiotic brand was last updated",
            },
          },
        },
        MedicalCondition: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The unique identifier of the medical condition",
            },
            name: {
              type: "string",
              description: "The name of the medical condition",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the medical condition was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the medical condition was last updated",
            },
          },
        },
        ProbioticRecord: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the probiotic record",
            },
            doctorId: {
              type: "string",
              description:
                "The unique identifier of the doctor who created the probiotic record",
            },
            patientId: {
              type: "string",
              description:
                "The unique identifier of the patient who the probiotic record is for",
            },
            fileId: {
              type: "string",
              nullable: true,
              description:
                "The unique identifier of the file associated with the probiotic record, if applicable",
            },
            result: {
              type: "object",
              description:
                "The probiotic record result, represented as a JSON value",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic record was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the probiotic record was last updated",
            },
          },
        },
      },
    },
    security: [],
  },
});
/* eslint-enable @typescript-eslint/naming-convention */
