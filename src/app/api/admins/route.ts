import { saltHashPassword } from "@/lib/auth";
import { adminSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { validator } from "../validator";

const GET = validator(async (req) => {
  if (req.token?.type !== UserType.Admin) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }
  const admins = await prisma.admin.findMany({
    include: {
      user: true,
    },
  });

  return ApiResponse.json(
    admins.map((admin) => {
      const { user, userId, ...adminInfo } = admin;
      const { password, salt, ...userInfo } = user;
      return {
        type: UserType.Admin,
        ...userInfo,
        ...adminInfo,
      };
    })
  );
});

const POST = validator(async (req) => {
  if (req.token?.type !== UserType.Admin) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ..._userInfo } = adminSchema.parse(body);

  const admin = await prisma.admin.create({
    data: {
      user: {
        create: {
          ..._userInfo,
          ...saltHashPassword(_userInfo.password),
        },
      },
    },
    include: {
      user: true,
    },
  });

  const { user, userId, ...adminInfo } = admin;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Admin,
    ...userInfo,
    ...adminInfo,
  });
});

export { GET, POST };
