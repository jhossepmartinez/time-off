"use server";
import { PrismaClient, Role } from "@prisma/client";
type UserData = {
  name: string;
  password: string;
  role: Role;
};

type LoginData = {
  name: string;
  password: string
};

export const createUser = async (userData: UserData) => {
  const prisma = new PrismaClient();
  const foundUser = await prisma.user.findFirst({
    where: {
      name: userData.name,
    },
  });
  if (foundUser) {
    throw new Error("User already exists");
  }
  await prisma.user.create({
    data: {
      name: userData.name,
      password: userData.password,
      role: userData.role,
      days: Math.floor(Math.random() * 25),
    },
  });
};

export const getUsers = async () => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  return users;
};

export const loginUser = async (loginData: LoginData) => {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        name: loginData.name,
        password: loginData.password,
      },
    });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    return {
        id: user.id,
        name: user.name,
        role: user.role,
        days: user.days,
    };
}
    

export const getUserById = async (id: string) => {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return user
}

