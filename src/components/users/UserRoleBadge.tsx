import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import type { UserRole } from "@/types/user";

interface UserRoleBadgeProps {
    role: UserRole;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
    if (role === "admin") {
        return (
            <Badge variant="success" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="gap-1">
            <User className="h-3 w-3" />
            Usuario
        </Badge>
    );
}
