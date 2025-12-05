import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
        header: "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg4NzhjZTY0NWM4ZWQ1MzRjNzQ2ZTVmMjMzMmI4YTkyNTgxNzU1YWM1In0",
        payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItc3dpcGVwYWQudmVyY2VsLmFwcCJ9",
        signature: "MHgyNmU2OWI2NjJmYWRhMzVjNTg4Nzg2ZDg4YjVjZTE4M2I4OTNlOWQzYTVjZDI2NzdkODA2M2E5YTRmOTJkMDI2NDc3MDJkNzQyYTc2Y2FhZTBjNTQ2ZJkYjZlYjZlYjZlYjZlYjZlYjZlYjZlYjZlYjZlYjZlYjZlYjZl"
    },
    frame: {
        version: "1",
        name: "SwipePad",
        iconUrl: "https://farcaster-swipepad.vercel.app/icon.svg",
        homeUrl: "https://farcaster-swipepad.vercel.app",
        imageUrl: "https://farcaster-swipepad.vercel.app/placeholder-logo.png",
        buttonTitle: "Launch App",
        splashImageUrl: "https://farcaster-swipepad.vercel.app/placeholder-logo.png",
        splashBackgroundColor: "#1F2732",
        webhookUrl: "https://farcaster-swipepad.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(config);
}
