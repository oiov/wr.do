import { prisma } from "@/lib/db";
import { checkUserStatus } from "@/lib/dto/user";
import { TIME_RANGES } from "@/lib/enums";
import { getCurrentUser } from "@/lib/session";
import { getStartDate } from "@/lib/utils";

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

    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d";

    const startDate = getStartDate(range);
    if (!startDate) {
      return Response.json({ statusText: "Invalid range" }, { status: 400 });
    }

    // Calculate previous period start and end dates
    const rangeDuration = TIME_RANGES[range];
    const prevStartDate = new Date(startDate.getTime() - rangeDuration);
    const prevEndDate = startDate;

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
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
          gte: startDate,
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
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });
    const emails = await prisma.userEmail.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });
    const inbox = await prisma.forwardEmail.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });
    const sends = await prisma.userSendEmail.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    // Fetch previous period data
    const prevUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const prevRecords = await prisma.userRecord.findMany({
      where: {
        created_on: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        created_on: true,
      },
    });
    const prevUrls = await prisma.userUrl.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const prevEmails = await prisma.userEmail.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const prevInbox = await prisma.forwardEmail.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const prevSends = await prisma.userSendEmail.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Process current period data
    const userCountByDate: { [date: string]: number } = {};
    const recordCountByDate: { [date: string]: number } = {};
    const urlCountByDate: { [date: string]: number } = {};
    const emailCountByDate: { [date: string]: number } = {};
    const inboxCountByDate: { [date: string]: number } = {};
    const sendCountByDate: { [date: string]: number } = {};

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
    emails.forEach((email) => {
      const date = email.createdAt.toISOString().split("T")[0];
      emailCountByDate[date] = (emailCountByDate[date] || 0) + 1;
    });
    inbox.forEach((email) => {
      const date = email.createdAt.toISOString().split("T")[0];
      inboxCountByDate[date] = (inboxCountByDate[date] || 0) + 1;
    });
    sends.forEach((send) => {
      const date = send.createdAt.toISOString().split("T")[0];
      sendCountByDate[date] = (sendCountByDate[date] || 0) + 1;
    });

    const allDates = Array.from(
      new Set([
        ...Object.keys(userCountByDate),
        ...Object.keys(recordCountByDate),
        ...Object.keys(urlCountByDate),
        ...Object.keys(emailCountByDate),
        ...Object.keys(inboxCountByDate),
        ...Object.keys(sendCountByDate),
      ]),
    );
    const combinedData = allDates.map((date) => ({
      date,
      records: recordCountByDate[date] || 0,
      urls: urlCountByDate[date] || 0,
      users: userCountByDate[date] || 0,
      emails: emailCountByDate[date] || 0,
      inbox: inboxCountByDate[date] || 0,
      sends: sendCountByDate[date] || 0,
    }));

    const total = {
      records: combinedData.reduce((acc, curr) => acc + curr.records, 0),
      urls: combinedData.reduce((acc, curr) => acc + curr.urls, 0),
      users: combinedData.reduce((acc, curr) => acc + curr.users, 0),
      emails: combinedData.reduce((acc, curr) => acc + curr.emails, 0),
      inbox: combinedData.reduce((acc, curr) => acc + curr.inbox, 0),
      sends: combinedData.reduce((acc, curr) => acc + curr.sends, 0),
    };

    // Calculate totals for previous period
    const prevTotal = {
      records: prevRecords.length,
      urls: prevUrls.length,
      users: prevUsers.length,
      emails: prevEmails.length,
      inbox: prevInbox.length,
      sends: prevSends.length,
    };

    // Calculate growth rates
    const growthRates = {
      records:
        prevTotal.records === 0
          ? total.records > 0
            ? 100
            : 0
          : ((total.records - prevTotal.records) / prevTotal.records) * 100,
      urls:
        prevTotal.urls === 0
          ? total.urls > 0
            ? 100
            : 0
          : ((total.urls - prevTotal.urls) / prevTotal.urls) * 100,
      users:
        prevTotal.users === 0
          ? total.users > 0
            ? 100
            : 0
          : ((total.users - prevTotal.users) / prevTotal.users) * 100,
      emails:
        prevTotal.emails === 0
          ? total.emails > 0
            ? 100
            : 0
          : ((total.emails - prevTotal.emails) / prevTotal.emails) * 100,
      inbox:
        prevTotal.inbox === 0
          ? total.inbox > 0
            ? 100
            : 0
          : ((total.inbox - prevTotal.inbox) / prevTotal.inbox) * 100,
      sends:
        prevTotal.sends === 0
          ? total.sends > 0
            ? 100
            : 0
          : ((total.sends - prevTotal.sends) / prevTotal.sends) * 100,
    };

    return Response.json({
      list: combinedData.reverse(),
      total,
      growthRates,
    });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
