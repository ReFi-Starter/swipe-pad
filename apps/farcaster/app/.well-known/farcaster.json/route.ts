
export const dynamic = 'force-dynamic'; // Force dynamic rendering to bypass build-time cache

export async function GET() {
  const config = {
    accountAssociation: {
        header: "eyJmaWQiOjgxMzAwNywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEYxQkMzYkY2OWU1ZmFEOEU0Mzg5NDE5MzE1NkU5MjVGQzMwOTVjNDcifQ",
        payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItc3dpcGVwYWQudmVyY2VsLmFwcCJ9",
        signature: "8Cu6bb8aSYoFTF92krInylAfalg9+YvcQH8MVrbSFAZiSukz0hvx/gVa8JuaUUReYMXuBVTZOWAN6zCkG5tmfxw="
    },
    frame: {
        version: "1",
        name: "SwipePad",
        iconUrl: "https://farcaster-swipepad.vercel.app/icon.png",
        homeUrl: "https://farcaster-swipepad.vercel.app",
        imageUrl: "https://farcaster-swipepad.vercel.app/splash.png",
        buttonTitle: "Launch App",
        splashImageUrl: "https://farcaster-swipepad.vercel.app/splash.png",
        splashBackgroundColor: "#1F2732"
    }
  };

  return new Response(JSON.stringify(config), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Instruct Vercel CDN and browser not to cache
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache', // Bypass CDN revalidation delay
    },
  });
}
