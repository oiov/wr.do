import { prisma } from "@/lib/db";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: threeMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });
    const records = await prisma.userRecord.findMany({
      where: {
        created_on: {
          gte: threeMonthsAgo,
        },
      },
      orderBy: {
        created_on: "desc",
      },
      select: {
        created_on: true,
      },
    });
    const urls = await prisma.userUrl.findMany({
      where: {
        createdAt: {
          gte: threeMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    const userCountByDate: { [date: string]: number } = {};
    const recordCountByDate: { [date: string]: number } = {};
    const urlCountByDate: { [date: string]: number } = {};

    users.forEach((user) => {
      const date = user.createdAt!.toISOString().split("T")[0];
      userCountByDate[date] = (userCountByDate[date] || 0) + 1;
    });
    records.forEach((record) => {
      const date = record.created_on!.toISOString().split("T")[0];
      recordCountByDate[date] = (recordCountByDate[date] || 0) + 1;
    });
    urls.forEach((url) => {
      const date = url.createdAt.toISOString().split("T")[0];
      urlCountByDate[date] = (urlCountByDate[date] || 0) + 1;
    });

    const allDates = Array.from(
      new Set([
        ...Object.keys(userCountByDate),
        ...Object.keys(recordCountByDate),
        ...Object.keys(urlCountByDate),
      ]),
    );
    const combinedData = allDates.map((date) => ({
      date,
      records: recordCountByDate[date] || 0,
      urls: urlCountByDate[date] || 0,
      users: userCountByDate[date] || 0,
    }));

    const total = {
      records: combinedData.reduce((acc, curr) => acc + curr.records, 0),
      urls: combinedData.reduce((acc, curr) => acc + curr.urls, 0),
      users: combinedData.reduce((acc, curr) => acc + curr.users, 0),
    };

    return Response.json({ list: combinedData.reverse(), total });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
