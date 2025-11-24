import { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(request: NextRequest) {\n  return NextResponse.json({ message: "Hello from /api/self" });\n}
