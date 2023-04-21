import { useState } from "react";

type UseCapitalizeFirstLetter = (input: string) => string;

const useCapitalizeFirstLetter: UseCapitalizeFirstLetter = (input) => {
  const [capitalizedString, setCapitalizedString] = useState<string>("");

  useState(() => {
    if (!input || typeof input !== "string") {
      setCapitalizedString("");
    } else {
      setCapitalizedString(input.charAt(0).toUpperCase() + input.slice(1));
    }
  });

  return capitalizedString;
};

export default useCapitalizeFirstLetter;
