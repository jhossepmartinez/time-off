"use server";
import { PrismaClient, RequestStatus } from "@prisma/client";


export const createRequest = async ({
  days,
  userId,
}: {
  days: number;
  userId: string;
}) => {
  const prisma = new PrismaClient();
    const foundUser = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
      },
    });
    if (!foundUser) {
      throw new Error("Usuario no encontrado");
    }
    if (foundUser?.days < days) {
      throw new Error("No hay suficiente dias para la solicitud");
    }
  await prisma.request.create({
    data: {
      days,
      userId: parseInt(userId),
    },
  });
}

export const getRequests = async () => {
    const prisma = new PrismaClient();
    const requests = await prisma.request.findMany({
        include: {
            user: true
        }
    });
    return requests;
}

export const updateRequestStatus = async (id: number, status: RequestStatus) => {
    const prisma = new PrismaClient();
    const foundRequest = await prisma.request.findFirst({
        where: {
            id: id,
        },
    });
    await prisma.request.update({
        where: {
            id: id,
        },
        data: {
            status: status,
        },
    });
    if (status === RequestStatus.APPROVED) {
        if (foundRequest && foundRequest.status === RequestStatus.APPROVED) 
            return;
        await prisma.user.update({
            where: {
                id: foundRequest?.userId,
            },
            data: {
                days: {
                    decrement: foundRequest?.days,
                },
            },
        })
    }
    if (status === RequestStatus.REJECTED) {
        if (foundRequest && foundRequest.status === RequestStatus.REJECTED) 
            return;
        await prisma.user.update({
            where: {
                id: foundRequest?.userId,
            },
            data: {
                days: {
                    increment: foundRequest?.days,
                },
            },
        })
    }
}

export const getRequestsByUserId = async (userId: string) => {
    const prisma = new PrismaClient();
    const requests = await prisma.request.findMany({
        where: {
            userId: parseInt(userId),
        },
        include: {
            user: true
        }
    });
    return requests;
}
