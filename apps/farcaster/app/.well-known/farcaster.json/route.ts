import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
        "header": "eyJmaWQiOjgxMzAwNywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEYxQkMzYkY2OWU1ZmFEOEU0Mzg5NDE5MzE1NkU5MjVGQzMwOTVjNDcifQ",
        "payload": "eyJkb21haW4iOiJmYXJjYXN0ZXItc3dpcGVwYWQudmVyY2VsLmFwcCJ9",
        "signature": "8Cu6bb8aSYoFTF92krInylAfalg9+YvcQH8MVrbSFAZiSukz0hvx/gVa8JuaUUReYMXuBVTZOWAN6zCkG5tmfxw="
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
