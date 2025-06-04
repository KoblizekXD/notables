import { Copyright } from "lucide-react";

export default function DashboardFooter() {
    return (
        <footer className="flex flex-col items-center justify-center h-24 border-t">
            <p className="text-sm text-gray-500 font-header">Made with love, on meth</p>
            <div className="w-full flex items-center justify-center gap-x-2">
                <Copyright size={20} strokeWidth={2.75} />
                <p className="flex flex-row gap-3 items-center font-semibold text-poppins  text-xl">Notables</p>
            </div>
        </footer>
    );
}
