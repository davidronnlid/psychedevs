import React from "react";

interface VerticalSpacerProps {
  size: string;
}

const VerticalSpacer: React.FC<VerticalSpacerProps> = ({ size }) => {
  return <div style={{ padding: `${size} 0` }}></div>;
};

export default VerticalSpacer;
