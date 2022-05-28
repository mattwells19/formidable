import {
  chakra,
  Text,
  UseCheckboxReturn,
  UseRadioReturn,
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
  htmlProps,
  getRootProps,
  value,
}: ToggleButtonProps) {
  // TODO: not focusable for some reason; ids are being duplicated

  return (
    <chakra.label
      flexGrow={1}
      display="grid"
      placeItems="center"
      maxW="40"
      bg={state.isChecked ? "green.300" : "transparent"}
      border="1px solid"
      borderColor={state.isChecked ? "green.300" : "green.500"}
      color={state.isChecked ? "black" : "inherit"}
      rounded="lg"
      p={3}
      cursor="pointer"
      {...htmlProps}
      {...getRootProps()}
      {...getCheckboxProps()}
      aria-hidden={undefined}
    >
      <input {...getInputProps()} hidden />
      <Text {...getLabelProps()}>
        {getOptionLabel ? getOptionLabel(value) : value}
      </Text>
    </chakra.label>
  );
}
