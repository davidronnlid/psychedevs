// TabPanel.tsx
import React from "react";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

export default function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
