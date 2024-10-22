import { GraduationCapIcon } from "lucide-react";
import { Link } from "react-router-dom";

function AuthPage() {
    return ( <div className=" flex flex-col min-h-screen">
        <header className=" px-4 lg:px-6 h-14 flex items-center border-b">
            <Link to={'/'} className="flex items-center justify-center">
            <GraduationCapIcon className=" h-8 w-8 mr-4 "/>
            <span className="font-extrabold">LMS Learn</span>
            </Link>

        </header>
        Auth
    </div> );
}

export default AuthPage;