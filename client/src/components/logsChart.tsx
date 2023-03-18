import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
interface Log {
  date: Date;
  value: number;
}

interface Logs {
  logs: Log[];
}

const Chart: React.FC<Logs> = ({ logs }) => {
  const datesAndValues = logs.map((log) => {
    return {
      date: log.date.toString().slice(0, 10),
      value: log.value,
    };
  });

  return (
    <LineChart width={500} height={300} data={datesAndValues}>
      <CartesianGrid />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        activeDot={{ r: 12 }}
      />
    </LineChart>
  );
};

export default Chart;
