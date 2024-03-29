import { Dispatch, SetStateAction, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { selectAnswerFormats } from "../../redux/answerFormatsSlice";
import { useAppSelector } from "../../redux/hooks";
import { AnswerFormat } from "../../typeModels/logTypeModel";

interface Props {
  setParentAnswerFormat: Dispatch<SetStateAction<string>>;
  defaultAnswerFormat: string;
}

const SelectAnswerFormat: React.FC<Props> = ({
  setParentAnswerFormat,
  defaultAnswerFormat,
}) => {
  const answerFormats = useAppSelector(
    (state) => selectAnswerFormats(state).answerFormats
  );

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const formattedAnswerFormats = answerFormats.map((answerFormat) => {
    return {
      ...answerFormat,
      answer_format: capitalizeFirstLetter(answerFormat.answer_format),
    };
  });

  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
    setParentAnswerFormat(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} variant="standard" required>
      <p style={{ marginBottom: "5px" }}>Answer Format:</p>

      <Select
        labelId="select-answer-format-label"
        id="select-answer-format"
        value={selectedValue === "" ? defaultAnswerFormat : selectedValue}
        onChange={handleChange}
        required
      >
        {Array.isArray(formattedAnswerFormats)
          ? formattedAnswerFormats.map((answerFormat: AnswerFormat) => (
              <MenuItem
                key={answerFormat.answer_format}
                value={answerFormat.answer_format}
              >
                {answerFormat.answer_format}
              </MenuItem>
            ))
          : null}
      </Select>
    </FormControl>
  );
};

export default SelectAnswerFormat;
