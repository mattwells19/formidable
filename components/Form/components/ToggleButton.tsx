import {
  chakra,
  Grid,
  Text,
  UseCheckboxReturn,
  UseRadioReturn,
  useToken,
} from "@chakra-ui/react";

export type ToggleButtonProps = (UseCheckboxReturn | UseRadioReturn) & {
  getOptionLabel?: (option: string) => string;
  value: string;
};

export default function ToggleButton({
  getOptionLabel,
  state,
  getCheckboxProps,
  getInputProps,
  getLabelProps,
  getRootProps,
  value,
}: ToggleButtonProps) {
  const [green, gray] = useToken("colors", ["green.600", "gray.400"]);

  return (
    <chakra.label
      flexGrow={1}
      cursor={state.isDisabled ? "not-allowed" : "pointer"}
      {...getRootProps()}
    >
      <Grid
        placeItems="center"
        maxW="40"
        border="1px solid"
        borderColor="green.500"
        rounded="lg"
        p={3}
        transition="all linear 50ms"
        _hover={{
          backgroundColor: `${green}35`,
        }}
        _checked={{
          backgroundColor: green,
          borderColor: green,
        }}
        _disabled={{
          backgroundColor: `${gray}35`,
          borderColor: "gray.400",
          color: "gray.400",
        }}
        _focus={{
          ring: "3px",
          ringColor: "blue.200",
        }}
        {...getCheckboxProps()}
        aria-hidden={undefined}
      >
        <input {...getInputProps()} />
        <Text {...getLabelProps()}>
          {getOptionLabel ? getOptionLabel(value) : value}
        </Text>
      </Grid>
    </chakra.label>
  );
}
