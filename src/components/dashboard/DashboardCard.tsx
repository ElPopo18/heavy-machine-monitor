import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  to: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

export const DashboardCard = ({
  to,
  icon: Icon,
  iconColor,
  title,
  description
}: DashboardCardProps) => {
  return (
    <Link to={to}>
      <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
          <Icon className={`h-8 w-8 ${iconColor}`} />
          <div>
            <h2 className="text-xl font-semibold text-white group-hover:text-gray-800 transition-colors">
              {title}
            </h2>
            <p className="text-white group-hover:text-gray-600 transition-colors">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};