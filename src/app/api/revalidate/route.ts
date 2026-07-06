import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paths: string[] = Array.isArray(body.paths) ? body.paths : []

    if (paths.length === 0) {
      return NextResponse.json({ message: 'No paths provided' }, { status: 400 })
    }

    for (const p of paths) {
      revalidatePath(p)
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Revalidation failed', error: err.message },
      { status: 500 }
    )
  }
}
