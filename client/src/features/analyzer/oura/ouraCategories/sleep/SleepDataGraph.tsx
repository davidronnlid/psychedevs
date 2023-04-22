import React from "react";

const SleepDataGraph = () => {
  return <div>SleepDataGraph</div>;
};

export default SleepDataGraph;

// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   TooltipProps,
// } from "recharts";
// import { SleepData } from "../../../../../typeModels/ouraModel";
// import Select from "react-select";
// import { useState } from "react";

// const findMinMaxValues = (data: SleepData[], dataTypes: DataTypeOption[]) => {
//   const minMaxValues: { [key: string]: { min: number; max: number } } = {};

//   dataTypes.forEach((dataType) => {
//     minMaxValues[dataType.value] = {
//       min: Number.POSITIVE_INFINITY,
//       max: Number.NEGATIVE_INFINITY,
//     };
//   });

//   data.forEach((item) => {
//     dataTypes.forEach((dataType) => {
//       const value = item[dataType.value];
//       minMaxValues[dataType.value].min = Math.min(
//         minMaxValues[dataType.value].min,
//         value
//       );
//       minMaxValues[dataType.value].max = Math.max(
//         minMaxValues[dataType.value].max,
//         value
//       );
//     });
//   });

//   return minMaxValues;
// };
// const normalizeData = (
//   data: SleepData[],
//   dataTypes: DataTypeOption[],
//   minMaxValues: { [key: string]: { min: number; max: number } }
// ) => {
//   return data.map((item) => {
//     const newItem: any = { ...item };

//     dataTypes.forEach((dataType) => {
//       const value = item[dataType.value];
//       const min = minMaxValues[dataType.value].min;
//       const max = minMaxValues[dataType.value].max;

//       newItem[dataType.value] = ((value - min) / (max - min)) * 100;
//     });

//     return newItem;
//   });
// };

// const availableDataTypes: DataTypeOption[] = [
//   { value: "average_breath", label: "Average Breath", color: "#8884d8" },
//   {
//     value: "average_heart_rate",
//     label: "Average Heart Rate",
//     color: "#82ca9d",
//   },
//   { value: "time_in_bed", label: "Time in Bed", color: "#FFBB28" },
//   {
//     value: "total_sleep_duration",
//     label: "Total Sleep Duration",
//     color: "#FF8042",
//   },
// ];
// type DataTypeOption = {
//   value: keyof SleepData;
//   label: string;
//   color: string;
// };
// interface SleepDataGraphProps {
//   sleepData: SleepData[];
// }

// interface CustomTooltipProps extends TooltipProps<any, any> {
//   minMaxValues: { [key: string]: { min: number; max: number } };
// }

// const CustomTooltip: React.FC<CustomTooltipProps> = ({
//   active,
//   payload,
//   label,
//   minMaxValues,
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         className="custom-tooltip"
//         style={{
//           backgroundColor: "#fff",
//           padding: "5px",
//           border: "1px solid #ccc",
//         }}
//       >
//         <p className="label">{`${label}`}</p>
//         {payload.map((data: any, index: number) => {
//           const min = minMaxValues[data.name].min;
//           const max = minMaxValues[data.name].max;
//           const originalValue = (data.value / 100) * (max - min) + min;

//           return (
//             <p key={index} className="desc" style={{ color: data.color }}>
//               {`${data.name}: ${originalValue.toFixed(2)}`}
//             </p>
//           );
//         })}
//       </div>
//     );
//   }

//   return null;
// };

// const SleepDataGraph: React.FC<SleepDataGraphProps> = ({ sleepData }) => {
//   // console.log("🚀 ~ file: SleepDataGraph.tsx:125 ~ sleepData:", sleepData);

//   const [selectedDataTypes, setSelectedDataTypes] =
//     useState<DataTypeOption[]>(availableDataTypes);
//   const minMaxValues = findMinMaxValues(sleepData, selectedDataTypes);
//   const normalizedData = normalizeData(
//     sleepData,
//     selectedDataTypes,
//     minMaxValues
//   );
//   console.log(
//     "🚀 ~ file: SleepDataGraph.tsx:133 ~ normalizedData:",
//     normalizedData
//   );

//   const tooltipFormatter = (value: any, name: string) => {
//     const min = minMaxValues[name].min;
//     const max = minMaxValues[name].max;
//     const originalValue = (value / 100) * (max - min) + min;

//     return [originalValue.toFixed(2), name];
//   };

//   const handleDropdownChange = (selectedOptions: any) => {
//     if (Array.isArray(selectedOptions)) {
//       setSelectedDataTypes(selectedOptions);
//     } else {
//       setSelectedDataTypes([]);
//     }
//   };

//   return (
//     <>
//       <Select
//         isMulti
//         options={availableDataTypes}
//         defaultValue={availableDataTypes}
//         onChange={handleDropdownChange}
//       />
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={normalizedData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="day" />
//           <YAxis domain={[0, 100]} />
//           <Tooltip content={<CustomTooltip minMaxValues={minMaxValues} />} />

//           <Legend />
//           {selectedDataTypes.map((dataType) => (
//             <Line
//               key={dataType.value}
//               type="monotone"
//               dataKey={dataType.value}
//               stroke={dataType.color}
//               activeDot={{ r: 8 }}
//             />
//           ))}
//         </LineChart>
//       </ResponsiveContainer>
//     </>
//   );
// };

// export default SleepDataGraph;
