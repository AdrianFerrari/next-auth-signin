import "./globals.css";
import AuthContext from "./AuthContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head />
            <body>
                <AuthContext>
                    <div className="flex justify-center items-center mx-auto h-screen bg-blue-300 bg-[url('/subtle-prism.svg')] bg-no-repeat">
                        <div className='md:w-3/5 md:h-3/4 flex flex-col justify-center gap-2 bg-slate-50 py-6 px-6 md:px-20 max-w-md shadow-md'>
                            {children}
                        </div>
                    </div>
                </AuthContext>
            </body>
        </html>
    );
}
/* background by SVGBackgrounds.com */
