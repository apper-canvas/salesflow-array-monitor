import React from "react";
import Badge from "@/components/atoms/Badge";

const statusConfig = {
  // Lead statuses
  new: { variant: "info", label: "New" },
  qualified: { variant: "warning", label: "Qualified" },
  contacted: { variant: "primary", label: "Contacted" },
  converted: { variant: "success", label: "Converted" },
  
  // Deal statuses
  prospect: { variant: "default", label: "Prospect" },
  proposal: { variant: "warning", label: "Proposal" },
  negotiation: { variant: "primary", label: "Negotiation" },
  "closed-won": { variant: "success", label: "Closed Won" },
  "closed-lost": { variant: "danger", label: "Closed Lost" },
  
  // Activity statuses
  active: { variant: "success", label: "Active" },
  inactive: { variant: "default", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" }
};

const StatusBadge = ({ status, className }) => {
  const config = statusConfig[status] || { variant: "default", label: status };
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;