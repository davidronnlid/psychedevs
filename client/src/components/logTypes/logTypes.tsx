import { useAppSelector } from "../../redux/hooks";
import { selectLogTypes } from "../../redux/logTypesSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const LogTypesData = () => {
  const logTypes = useAppSelector(selectLogTypes);
  //   const [addLogType, isLoading, error] = useAddLogType();
  //   // The case of users adding logs should be handled more

  //   const handleAddLogType = async () => {
  //     try {
  //       const result = await addLogType(newLogType);
  //       setLogTypes((prevLogTypes) => {
  //         if (typeof result !== "undefined") {
  //           return [...prevLogTypes, result];
  //         } else {
  //           return prevLogTypes;
  //         }
  //       });

  //       setNewLogType({ name: "", answer_format: "" });
  //     } catch (error) {
  //       console.error("Error adding log type: ", error);
  //     }
  //   };

  //   const handleRemoveLogType = async (name: string) => {
  //     try {
  //       await fetch(`/api/log-types/${name}`, {
  //         method: "DELETE",
  //       });
  //       setLogTypes((prevLogTypes) =>
  //         prevLogTypes.filter((logType) => logType.name !== name)
  //       );
  //     } catch (error) {
  //       console.error("Error removing log type: ", error);
  //     }
  //   };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Answer Format</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logTypes.map((logType) => (
            <TableRow key={logType.name}>
              <TableCell>{logType.name}</TableCell>
              <TableCell>{logType.answer_format}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default LogTypesData;
