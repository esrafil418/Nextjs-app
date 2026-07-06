import { getCurrentUser } from "@/app/lib/auth";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{
					error: "You are not authentication",
				},
				{ status: 401 },
			);
		}
		return NextResponse.json(user);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				error: "Server error",
			},
			{ status: 500 },
		);
	}
}
