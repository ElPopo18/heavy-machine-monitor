export interface MaintenanceEvent {
  id: string;
  scheduled_date: string;
  equipment: {
    name: string;
  };
  operator: {
    first_name: string;
    last_name: string;
  };
  observations: string | null;
}