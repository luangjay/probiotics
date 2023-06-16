import { createSwaggerSpec } from "next-swagger-doc";

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
          summary: "Returns the hello world",
          tags: ["Hello"],
          responses: {
            "200": {
              description: "Hello world!",
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hello World!",
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/register/doctor": {
        post: {
          summary: "Registers a new doctor",
          tags: ["Auth"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterDoctor",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "OK",
              schema: {
                $ref: "#/components/schemas/Doctor",
              },
            },
            "400": {
              description: "Bad request",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Returns a list of all users",
          tags: ["Users"],
          responses: {
            "200": {
              description: "A list of all users",
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
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
      schemas: {
        RegisterDoctor: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "The username of the doctor being registered.",
            },
            password: {
              type: "string",
              description: "The password for the doctor being registered.",
            },
            email: {
              type: "string",
              description:
                "The email address of the doctor being registered (optional).",
            },
            prefix: {
              type: "string",
              description: "The prefix of the doctor's name.",
            },
            firstName: {
              type: "string",
              description: "The first name of the doctor.",
            },
            lastName: {
              type: "string",
              description: "The last name of the doctor.",
            },
          },
          required: ["username", "password", "prefix", "firstName", "lastName"],
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier for the user.",
            },
            username: {
              type: "string",
              description: "The username of the user.",
            },
            email: {
              type: "string",
              nullable: true,
              description: "The email address of the user.",
            },
            prefix: {
              type: "string",
              description: "The prefix of the user's name.",
            },
            firstName: {
              type: "string",
              description: "The first name of the user.",
            },
            lastName: {
              type: "string",
              description: "The last name of the user.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was last updated.",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "The unique identifier of the user who is a doctor.",
            },
          },
        },
        Patient: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description:
                "The unique identifier of the user who is a patient.",
            },
            ssn: {
              type: "string",
              description: "The social security number of the patient.",
            },
            gender: {
              type: "string",
              description: "The gender of the patient.",
              enum: ["Male", "Female", "Others"],
            },
            birthDate: {
              type: "string",
              format: "date",
              description: "The date of birth of the patient.",
            },
            ethnicity: {
              type: "string",
              nullable: true,
              description: "The ethnicity of the patient.",
            },
          },
        },
        Admin: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "The unique identifier of the user who is an admin.",
            },
          },
        },
        File: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier for the file.",
            },
            uri: {
              type: "string",
              description: "The URI of the file.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the file was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the file was last updated.",
            },
          },
        },
        Probiotic: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The unique identifier for the probiotic.",
            },
            parentId: {
              type: "number",
              nullable: true,
              description:
                "The unique identifier of the parent probiotic (if applicable).",
            },
            name: {
              type: "string",
              description: "The name of the probiotic.",
            },
            red: {
              type: "number",
              description: "The red threshold for the probiotic results.",
            },
            yellow: {
              type: "number",
              description: "The yellow threshold for the probiotic results.",
            },
            green: {
              type: "number",
              description: "The green threshold for the probiotic results.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic was last updated.",
            },
          },
        },
        ProbioticBrand: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The unique identifier for the probiotic brand.",
            },
            name: {
              type: "string",
              description: "The name of the probiotic brand.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the probiotic brand was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the probiotic brand was last updated.",
            },
          },
        },
        MedicalCondition: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The unique identifier for the medical condition.",
            },
            name: {
              type: "string",
              description: "The name of the medical condition.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the medical condition was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the medical condition was last updated.",
            },
          },
        },
        ProbioticRecord: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier for the probiotic record.",
            },
            doctorId: {
              type: "string",
              description:
                "The unique identifier of the doctor who created the probiotic record.",
            },
            patientId: {
              type: "string",
              description:
                "The unique identifier of the patient who the probiotic record is for.",
            },
            fileId: {
              type: "string",
              nullable: true,
              description:
                "The unique identifier for the file associated with the probiotic record, if applicable.",
            },
            result: {
              type: "object",
              description:
                "The probiotic record result, represented as a JSON value.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the probiotic record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The date and time the probiotic record was last updated.",
            },
          },
        },
      },
    },
    security: [],
  },
});
/* eslint-enable @typescript-eslint/naming-convention */
