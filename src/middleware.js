import { NextResponse } from "next/server"

const publicRoutes = [
    {path: '/sigin', whenAuthenticated: 'redirect'},
    {path: '/register', whenAuthenticated: 'redirect'},
    {path: '/pricing', whenAuthenticated: 'next'}
]

const REDIRECT_WHEN_NOT_AUTHETICATED_ROUTE = '/sigin'

export function middleware(request){

    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(value => value.path === path)
    const authToken = request.cookies.get('token')

    if(!authToken && publicRoute){
        return NextResponse.next()
    }


    //Quando não estiver Autenticado e querer acessar uma rota privada
    if(!authToken && !publicRoute){
        const redictUrl = request.nextUrl.clone()

        redictUrl.pathname = REDIRECT_WHEN_NOT_AUTHETICATED_ROUTE

        return NextResponse.redirect(redictUrl)
    }

    if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){

        const redictUrl = request.nextUrl.clone()

        redictUrl.pathname = '/'

        return NextResponse.redirect(redictUrl)
    }

    if(authToken && !publicRoute){
        //Checar se o JWT está EXPIRADO
        //Se sim, remover o cookie e redirecionar o usuário para o login
        
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
         /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
   
    ]
}
