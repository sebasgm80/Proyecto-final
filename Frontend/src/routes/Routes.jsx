import { createBrowserRouter } from "react-router-dom"
import  { App } from "../App"
import { Dashboard, Error, FormProfile, Home, Login, Profile, Register } from "../pages"
import { Protected } from "../components/ProtectedREoutes/Protected"

export const router = createBrowserRouter ([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/profile",
                element:(
                    <Protected>
                        <Profile />
                    </Protected>
                )
            },
            {
                path: "/formProfile",
                element:(
                    <Protected>
                        <FormProfile />
                    </Protected>
                )
            },
            {
                path: "/dashboard",
                element: (
                    <Protected>
                        <Dashboard />
                    </Protected>
                )
            },
            {
                path: "*",
                element: <Error />
            }
        ]
    }
])
