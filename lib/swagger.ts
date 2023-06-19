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
          tags: ["Users"],
          summary: "Get all users",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
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
          tags: ["Admins"],
          summary: "Get all admins",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Admins"],
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
          tags: ["Admins"],
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
          tags: ["Admins"],
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
          tags: ["Admins"],
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
          tags: ["Doctors"],
          summary: "Get all doctors",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Doctors"],
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
          tags: ["Doctors"],
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
          tags: ["Doctors"],
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
          tags: ["Doctors"],
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
          tags: ["Patients"],
          summary: "Get all patients",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Patients"],
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
          tags: ["Patients"],
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
          tags: ["Patients"],
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
          tags: ["Patients"],
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
          tags: ["Patients"],
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
          tags: ["Patients"],
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
      "/api/patients/{user-id}/medical-conditions/{condition-id}": {
        delete: {
          tags: ["Patients"],
          summary: "Remove a patient's medical condition",
          parameters: [
            { $ref: "#/components/parameters/patientId" },
            { $ref: "#/components/parameters/conditionId" },
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
          tags: ["Probiotics"],
          summary: "Get all probiotics",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotics/{id}": {
        get: {
          tags: ["Probiotics"],
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
      "/api/probiotic-brands": {
        get: {
          tags: ["Probiotic Brands"],
          summary: "Get all probiotic brands",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-brands/{id}": {
        get: {
          tags: ["Probiotic Brands"],
          summary: "Get a probiotic brand by id",
          parameters: [{ $ref: "#/components/parameters/probioticBrandId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/medical-conditions": {
        get: {
          tags: ["Medical Conditions"],
          summary: "Get all medical conditions",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/medical-conditions/{id}": {
        get: {
          tags: ["Medical Conditions"],
          summary: "Get a medical condition by id",
          parameters: [{ $ref: "#/components/parameters/medicalConditionId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-records": {
        get: {
          tags: ["Probiotic Records"],
          summary: "Get all probiotic records",
          responses: {
            "200": { description: "OK" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Probiotic Records"],
          summary: "Create a new probiotic record",
          requestBody: { $ref: "#/components/requestBodies/ProbioticRecord" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-records/{id}": {
        get: {
          tags: ["Probiotic Records"],
          summary: "Get a probiotic record by id",
          parameters: [{ $ref: "#/components/parameters/probioticRecordId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Probiotic Records"],
          summary: "Update a probiotic record by id",
          parameters: [{ $ref: "#/components/parameters/probioticRecordId" }],
          requestBody: { $ref: "#/components/requestBodies/ProbioticRecord" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Probiotic Records"],
          summary: "Delete a probiotic record by id",
          parameters: [{ $ref: "#/components/parameters/probioticRecordId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-records/{id}/probiotic-brands": {
        get: {
          tags: ["Probiotic Records"],
          summary: "Get a probiotic record's probiotic brands",
          parameters: [{ $ref: "#/components/parameters/probioticRecordId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Probiotic Records"],
          summary: "Add a probiotic record's probiotic brand",
          parameters: [{ $ref: "#/components/parameters/probioticRecordId" }],
          requestBody: {
            $ref: "#/components/requestBodies/AddProbioticRecordProbioticBrand",
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
      "/api/probiotic-records/{id}/probiotic-brands/{brand-id}": {
        delete: {
          tags: ["Probiotic Records"],
          summary: "Remove a probiotic record's probiotic brand",
          parameters: [
            { $ref: "#/components/parameters/probioticRecordId" },
            { $ref: "#/components/parameters/brandId" },
          ],
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
        probioticBrandId: {
          name: "id",
          in: "path",
          description: "The id of the probiotic brand",
          required: true,
          type: "integer",
        },
        brandId: {
          name: "brand-id",
          in: "path",
          description: "The id of the probiotic brand",
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
        conditionId: {
          name: "condition-id",
          in: "path",
          description: "The id of the medical condition",
          required: true,
          type: "integer",
        },
        probioticRecordId: {
          name: "id",
          in: "path",
          description: "The id of the probiotic record",
          required: true,
          type: "string",
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
        ProbioticRecord: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                      "The unique identifier of the file associated with the probiotic record",
                  },
                  result: {
                    type: "object",
                    description:
                      "The probiotic record result, represented as a JSON value",
                  },
                },
              },
            },
          },
        },
        AddProbioticRecordProbioticBrand: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  probioticBrandId: {
                    type: "integer",
                    description: "The unique identifier of the probiotic brand",
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
                "The unique identifier of the file associated with the probiotic record",
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
