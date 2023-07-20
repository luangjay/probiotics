import {
  ENUM_GENDER,
  MAX_PASSWORD,
  MAX_USERNAME,
  MIN_PASSWORD,
  MIN_USERNAME,
  PATTERN_SSN,
  PATTERN_USERNAME,
} from "@/lib/schema";
import { createSwaggerSpec } from "next-swagger-doc";

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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/doctors/{user-id}/visit-datas": {
        get: {
          tags: ["Doctors"],
          summary: "Get a doctor's visit datas",
          parameters: [{ $ref: "#/components/parameters/doctorId" }],
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients/{user-id}/visit-datas": {
        get: {
          tags: ["Patients"],
          summary: "Get a patient's visit datas",
          parameters: [{ $ref: "#/components/parameters/patientId" }],
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
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
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/patients/{user-id}/medical-conditions/{medical-condition-id}": {
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
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/microorganisms": {
        get: {
          tags: ["Microorganisms"],
          summary: "Get all microorganisms",
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/microorganisms/{id}": {
        get: {
          tags: ["Microorganisms"],
          summary: "Get a microorganism by id",
          parameters: [{ $ref: "#/components/parameters/microorganismId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-brands": {
        get: {
          tags: ["Probiotic brands"],
          summary: "Get all probiotic brands",
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Probiotic brands"],
          summary: "Create a new probiotic brand",
          requestBody: { $ref: "#/components/requestBodies/ProbioticBrand" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/probiotic-brands/{id}": {
        get: {
          tags: ["Probiotic brands"],
          summary: "Get a probiotic brand by id",
          parameters: [{ $ref: "#/components/parameters/probioticBrandId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Probiotic brands"],
          summary: "Update a probiotic brand by user id",
          parameters: [{ $ref: "#/components/parameters/probioticBrandId" }],
          requestBody: { $ref: "#/components/requestBodies/ProbioticBrand" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Probiotic brands"],
          summary: "Delete a probiotic brand by user id",
          parameters: [{ $ref: "#/components/parameters/probioticBrandId" }],
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "400": { description: "Bad request" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/medical-conditions": {
        get: {
          tags: ["Medical conditions"],
          summary: "Get all medical conditions",
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/medical-conditions/{id}": {
        get: {
          tags: ["Medical conditions"],
          summary: "Get a medical condition by id",
          parameters: [{ $ref: "#/components/parameters/medicalConditionId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/visit-datas": {
        get: {
          tags: ["Visit datas"],
          summary: "Get all visit datas",
          responses: {
            "200": { description: "OK" },
            "401": { description: "Unauthorized" },
            "500": { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Visit datas"],
          summary: "Create a new visit data",
          requestBody: { $ref: "#/components/requestBodies/VisitData" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/visit-datas/{id}": {
        get: {
          tags: ["Visit datas"],
          summary: "Get a visit data by id",
          parameters: [{ $ref: "#/components/parameters/visitDataId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Visit datas"],
          summary: "Update a visit data by id",
          parameters: [{ $ref: "#/components/parameters/visitDataId" }],
          requestBody: { $ref: "#/components/requestBodies/VisitData" },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
            "500": { description: "Internal server error" },
          },
        },
        delete: {
          tags: ["Visit datas"],
          summary: "Delete a visit data by id",
          parameters: [{ $ref: "#/components/parameters/visitDataId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
      },
      "/api/visit-datas/{id}/file": {
        get: {
          tags: ["Visit datas"],
          summary: "Get a visit data's file",
          parameters: [{ $ref: "#/components/parameters/visitDataId" }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "500": { description: "Internal server error" },
          },
        },
        put: {
          tags: ["Visit datas"],
          summary: "Upload a visit data's file",
          parameters: [{ $ref: "#/components/parameters/visitDataId" }],
          requestBody: {
            $ref: "#/components/requestBodies/AddVisitDataFile",
          },
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
            "401": { description: "Unauthorized" },
            "404": { description: "Not found" },
            "409": { description: "Conflict" },
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
          default: "",
        },
        adminId: {
          name: "user-id",
          in: "path",
          description: "The user id of the admin",
          required: true,
          type: "string",
          default: "",
        },
        doctorId: {
          name: "user-id",
          in: "path",
          description: "The user id of the doctor",
          required: true,
          type: "string",
          default: "",
        },
        patientId: {
          name: "user-id",
          in: "path",
          description: "The user id of the patient",
          required: true,
          type: "string",
          default: "",
        },
        microorganismId: {
          name: "id",
          in: "path",
          description: "The id of the microorganism",
          required: true,
          type: "integer",
          default: "",
        },
        probioticBrandId: {
          name: "id",
          in: "path",
          description: "The id of the probiotic brand",
          required: true,
          type: "integer",
          default: "",
        },
        brandId: {
          name: "brand-id",
          in: "path",
          description: "The id of the probiotic brand",
          required: true,
          type: "integer",
          default: "",
        },
        medicalConditionId: {
          name: "id",
          in: "path",
          description: "The id of the medical condition",
          required: true,
          type: "integer",
          default: "",
        },
        conditionId: {
          name: "medical-condition-id",
          in: "path",
          description: "The id of the medical condition",
          required: true,
          type: "integer",
          default: "",
        },
        visitDataId: {
          name: "id",
          in: "path",
          description: "The id of the visit data",
          required: true,
          type: "string",
          default: "",
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
                    minLength: MIN_USERNAME,
                    maxLength: MAX_USERNAME,
                    pattern: PATTERN_USERNAME,
                  },
                  password: {
                    type: "string",
                    description: "The password of the admin",
                    minLength: MIN_PASSWORD,
                    maxLength: MAX_PASSWORD,
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
                    minLength: MIN_USERNAME,
                    maxLength: MAX_USERNAME,
                    pattern: PATTERN_USERNAME,
                  },
                  password: {
                    type: "string",
                    description: "The password of the doctor",
                    minLength: MIN_PASSWORD,
                    maxLength: MAX_PASSWORD,
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
                    minLength: MIN_USERNAME,
                    maxLength: MAX_USERNAME,
                    pattern: PATTERN_USERNAME,
                  },
                  password: {
                    type: "string",
                    description: "The password of the patient",
                    minLength: MIN_PASSWORD,
                    maxLength: MAX_PASSWORD,
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
                    pattern: PATTERN_SSN,
                  },
                  gender: {
                    type: "string",
                    enum: ENUM_GENDER,
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
        ProbioticBrand: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the probiotic brand",
                  },
                },
              },
            },
          },
        },
        VisitData: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  doctorId: {
                    type: "string",
                    description:
                      "The unique identifier of the doctor who created the visit data",
                  },
                  patientId: {
                    type: "string",
                    description:
                      "The unique identifier of the patient who the visit data is for",
                  },
                  fileId: {
                    type: "string",
                    nullable: true,
                    description:
                      "The unique identifier of the file associated with the visit data",
                  },
                  result: {
                    type: "object",
                    description:
                      "The visit data result, represented as a JSON value",
                  },
                },
              },
            },
          },
        },
        AddVisitDataFile: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    default: "",
                  },
                },
              },
            },
          },
        },
        AddVisitDataProbioticBrand: {
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
              pattern: PATTERN_SSN,
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
        Microorganism: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The unique identifier of the microorganism",
            },
            name: {
              type: "string",
              description: "The name of the microorganism",
              minLength: 1,
            },
            essential: {
              type: "boolean",
              description: "Whether the microorganism is in the essential list",
            },
            probiotic: {
              type: "boolean",
              description: "Whether the microorganism is a probiotic",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the microorganism was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the microorganism was last updated",
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
        VisitData: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the visit data",
            },
            doctorId: {
              type: "string",
              description:
                "The unique identifier of the doctor who created the visit data",
            },
            patientId: {
              type: "string",
              description:
                "The unique identifier of the patient who the visit data is for",
            },
            fileUri: {
              type: "string",
              nullable: true,
              description:
                "The unique identifier of the file associated with the visit data",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the visit data was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the visit data was last updated",
            },
          },
        },
      },
    },
    security: [],
  },
});
