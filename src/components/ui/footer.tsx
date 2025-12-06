export function Footer() {


    return (
        <footer className="mt-auto border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-8 max-w-[1280px]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Developer Credit */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Desarrollado por</span>
                        <span className="font-semibold text-green-600">
                            Xetid
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
