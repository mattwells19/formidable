import {
  Stat,
  Button,
  Code,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FC, useEffect, useReducer, useRef } from "react";
import { FormElement, FormValidationState } from "./types";

interface IDebugFormProps {
  fields: Array<FormElement>;
  formErrorMap: Map<string, string>;
  touchedFields: Set<string>;
  formValidationState: FormValidationState;
}

const DebugForm: FC<IDebugFormProps> = ({
  fields,
  formErrorMap,
  touchedFields,
  formValidationState,
}) => {
  const renderCounterRef = useRef<number>(0);
  const [, reset] = useReducer(() => {
    renderCounterRef.current = 0;
    return new Map();
  }, new Map());

  useEffect(() => {
    renderCounterRef.current += 1;
  });

  return (
    <StatGroup
      flexWrap="wrap"
      gap="5"
      marginY="8"
      sx={{
        dt: { fontSize: "lg", whiteSpace: "nowrap" },
      }}
    >
      <Stat>
        <StatLabel>Renders</StatLabel>
        <StatNumber>{renderCounterRef.current}</StatNumber>
        <Button display="block" onClick={reset}>
          Reset
        </Button>
      </Stat>
      <Stat>
        <StatLabel>Validation State</StatLabel>
        <Code>
          <pre>{formValidationState}</pre>
        </Code>
      </Stat>
      <Stat>
        <StatLabel>Registered Fields</StatLabel>
        <Code>
          <pre>{JSON.stringify(fields, undefined, 2)}</pre>
        </Code>
      </Stat>
      <Stat>
        <StatLabel>Errors</StatLabel>
        <Code>
          <pre>{JSON.stringify(Array.from(formErrorMap), undefined, 2)}</pre>
        </Code>
      </Stat>
      <Stat>
        <StatLabel>Touched</StatLabel>
        <Code>
          <pre>{JSON.stringify(Array.from(touchedFields), undefined, 2)}</pre>
        </Code>
      </Stat>
    </StatGroup>
  );
};

export default DebugForm;
