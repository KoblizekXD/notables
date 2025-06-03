import { Copyright } from "lucide-react";

export default function DashboardFooter() {
    return (
        <div className="flex flex-col items-center justify-center h-24 border-t">
            <p className="text-sm text-gray-500">Made with love on meth</p>
            <div className="w-full flex items-center justify-center">
                <p className="flex flex-row gap-3 items-center text-lg">
                    <Copyright size={20} />
                    Notables
                </p>
            </div>
        </div>
    );
}
