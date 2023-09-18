import { NextResponse, type NextRequest } from "next/server";
import ogs from "open-graph-scraper";

export async function POST(request: NextRequest) {
    try {
        let { url } = await request.json();
        if (!url) {
            return NextResponse.json({
                data: "Url not provided!",
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
        return NextResponse.json({
            data: {
                favicon: data.result.favicon,
                ogDescription: data.result.ogDescription,
                ogTitle: data.result.ogTitle,
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
