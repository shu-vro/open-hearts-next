import { NextResponse, type NextRequest } from "next/server";
import ogs from "open-graph-scraper";
import { OgObject } from "open-graph-scraper/dist/lib/types";

export async function POST(request: NextRequest) {
    try {
        let { url, get }: { url: string; get: (keyof OgObject)[] } =
            await request.json();
        if (!url) {
            return NextResponse.json({
                data: "Url not provided!",
                error: true,
            });
        }
        if (!get.length) {
            return NextResponse.json({
                data: "Get parameter not provided!",
                error: true,
            });
        }
        let data = await ogs({ url });

        if (data.error) {
            return NextResponse.json({
                data: "Url Doesn't exist",
                error: true,
            });
        }
        let result = { ...data.result };
        let resultObject: OgObject = {};

        for (const key of get) {
            if (result.hasOwnProperty(key)) {
                resultObject[key] = result[key] as any;
            }
        }
        return NextResponse.json({
            data: {
                ...resultObject,
            },
            error: false,
        });
    } catch (e) {
        return NextResponse.json({
            data: "app/(after-login)/chats/api/route.ts - Unexpected error",
            error: true,
            throwError: e,
        });
    }
}

export const revalidate = 60;
