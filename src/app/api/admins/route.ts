import { saltHashPassword } from "@/lib/auth";
import { adminSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
import { ApiResponse } from "@/types/rest";
import { revalidatePath } from "next/cache";
import { handler } from "../handler";

const GET = handler(async (req) => {
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

const POST = handler(async (req) => {
  if (req.token?.type !== UserType.Admin) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ...pUser } = adminSchema.parse(body);

  const admin = await prisma.admin.create({
    data: {
      user: {
        create: {
          ...pUser,
          ...saltHashPassword(pUser.password),
        },
      },
    },
    include: {
      user: true,
    },
  });

  revalidatePath("/patients");

  const { user, userId, ...adminInfo } = admin;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Admin,
    ...userInfo,
    ...adminInfo,
  });
});

export { GET, POST };
