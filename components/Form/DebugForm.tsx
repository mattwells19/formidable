import {
  Stat,
  Button,
  Code,
  Box,
  StatGroup,
  StatLabel,
  StatNumber,
  Heading,
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
    <Box as="section">
      <Heading as="h2" fontSize="3xl">
        Form State Info
      </Heading>
      <StatGroup
        display="grid"
        gridTemplateColumns={{
          base: "repeat(auto-fit, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap="5"
        marginY="8"
        sx={{
          dt: { fontSize: "lg", whiteSpace: "nowrap", fontWeight: "bold" },
        }}
      >
        <Stat>
          <StatLabel>Form Re-renders</StatLabel>
          <StatNumber>
            {renderCounterRef.current}
            <Button display="block" onClick={reset}>
              Reset
            </Button>
          </StatNumber>
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
    </Box>
  );
};

export default DebugForm;
