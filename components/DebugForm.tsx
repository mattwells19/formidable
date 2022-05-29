import {
  Stat,
  Button,
  Code,
  Box,
  StatGroup,
  StatLabel,
  StatNumber,
  Heading,
  StatHelpText,
} from "@chakra-ui/react";
import { FC, MutableRefObject, useEffect, useReducer, useRef } from "react";
import { FormElement, FormValidationState } from "./Form/types";
import { extractFormValues } from "./Form/utils";

interface IDebugFormProps {
  fields: Array<FormElement>;
  formErrorMap: Map<string, string>;
  touchedFields: Set<string>;
  formValidationState: FormValidationState;
  formRef: MutableRefObject<HTMLFormElement | null>;
}

const DebugForm: FC<IDebugFormProps> = ({
  fields,
  formErrorMap,
  touchedFields,
  formValidationState,
  formRef,
}) => {
  const renderCounterRef = useRef<number>(1);
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
          base: "repeat(auto-fit, min-content)",
          md: "repeat(2, min-content)",
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
          <StatNumber>
            <Code>
              <pre>{formValidationState}</pre>
            </Code>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Form Values</StatLabel>
          {formRef.current ? (
            <StatNumber>
              <Code>
                <pre>
                  {JSON.stringify(
                    extractFormValues(fields, new FormData(formRef.current)),
                    undefined,
                    2
                  )}
                </pre>
              </Code>
            </StatNumber>
          ) : null}
          <StatHelpText>
            Uses ref so only updates on re-renders. Click the Reset button to
            force a re-render.
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Touched</StatLabel>
          <StatNumber>
            <Code>
              <pre>
                {JSON.stringify(Array.from(touchedFields), undefined, 2)}
              </pre>
            </Code>
          </StatNumber>
          <StatHelpText>
            Names prefixed with &apos;formatted_&apos; use a dummy controlled
            input for display purposes and a hidden input for the actual value.
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Registered Fields</StatLabel>
          <StatNumber>
            <Code>
              <pre>{JSON.stringify(fields, undefined, 2)}</pre>
            </Code>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Errors</StatLabel>
          <StatNumber>
            <Code>
              <pre>
                {JSON.stringify(Array.from(formErrorMap), undefined, 2)}
              </pre>
            </Code>
          </StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  );
};

export default DebugForm;
