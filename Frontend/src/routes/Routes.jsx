import { createBrowserRouter } from "react-router-dom"
import  { App } from "../App"
import { AddBook, Dashboard, Error, FormProfile, Home, Login, Profile, Register, BookDetails } from "../pages"
import { Protected } from "../components/ProtectedREoutes/Protected"
import AllBooks from "../components/AllBooks"
import UpdateBookForm from "../pages/UpdateBookForm"

UpdateBookForm
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
                path: "/books",
                element: <AllBooks />
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
                path: "/addProduct",
                element: (
                    <Protected>
                        <AddBook />
                    </Protected>
                )
            },
            {
                path: "/Update/:bookId",
                element: (
                    <Protected>
                        <UpdateBookForm />
                    </Protected>
                )
            },
            
            {
                path: "/book/:bookId",
                element: (
                    <Protected>
                        <BookDetails />
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
