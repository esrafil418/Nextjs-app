import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role, User } from "../types";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
	return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { userId: string } => {
	const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

	if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
		throw new Error("Invalid token: userId not found");
	}

	return { userId: decoded.userId as string };
};

export const getCurrentUser = async (): Promise<User | null> => {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;
		if (!token) return null;
		const decode = verifyToken(token);

		const userFromDb = await prisma.user.findUnique({
			where: { id: decode.userId },
		});
		if (!userFromDb) return null;
		const { password, ...user } = userFromDb;
		return user as User;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const checkUserPermission = (
	user: User,
	requiredRole: Role,
): boolean => {
	const roleHierarchy = {
		[Role.GUEST]: 0,
		[Role.USER]: 1,
		[Role.MANAGER]: 2,
		[Role.ADMIN]: 3,
	};
	return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
