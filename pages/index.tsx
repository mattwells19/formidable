import { Container, Button, useDisclosure } from "@chakra-ui/react";
import Form, { Field, FormValidationState, zu } from "../components/Form";
import zod from "zod";

const movieOptions = ["The Peanut Butter Falcon", "Harry Potter", "Arrival"];
const bookOptions = ["Anxious People", "Martyn Pig", "Lucas", "Other"];
const foodOptions = ["Pizza", "Burger", "Salmon", "Anything else"];

const formValidation = zod.object({
  favoriteColor: zu.text,
  favoriteNumber: zu.number,
  favoriteMovie: zod.string().optional(),
  favoriteMovieExplanation: zod.string().min(10).max(500),
  favoriteBook: zu.multi,
  favoriteFood: zu.radio,
});

const formValidationWithOther = formValidation.merge(
  zod.object({
    otherFavoriteBook: zu.text,
  })
);

type FormValues = {
  favoriteColor: string;
  favoriteNumber: number;
  favoriteMovie?: string;
  favoriteMovieExplanation: string;
  favoriteBook: Array<string>;
  favoriteFood: string;
  otherFavoriteBook?: string;
};

export default function App() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const handleSubmit = (formValues: FormValues) => {
    console.log(formValues);
  };

  return (
    <Container marginY="10">
      <Form
        onSubmit={handleSubmit}
        display="flex"
        flexDir="column"
        gap="5"
        justifyContent="flex-start"
        validationShape={isOpen ? formValidationWithOther : formValidation}
        ignoreTouch={false}
      >
        {(formValidationState) => (
          <>
            <Field type="text" name="favoriteColor" label="Favorite Color" />
            <Field
              type="number"
              name="favoriteNumber"
              label="Favorite Number"
              tooltipText="Has to be positive"
              min="0"
            />
            <Field
              type="select"
              name="favoriteMovie"
              label="Favorite Movie"
              isOptional
              options={movieOptions}
              placeholder="Make a selection"
            />
            <Field
              type="textarea"
              name="favoriteMovieExplanation"
              label="Explain why it's your favorite movie."
              helperText="Min 10 characters"
              minLength={10}
            />
            <Field
              type="toggle-checkbox"
              options={bookOptions}
              name="favoriteBook"
              label="Favorite Book"
              onChange={(values) => {
                if (values.includes("Other") && !isOpen) {
                  onOpen();
                } else if (!values.includes("Other") && isOpen) {
                  onClose();
                }
              }}
            />
            {isOpen ? (
              <Field
                type="text"
                name="otherFavoriteBook"
                label="Other Favorite Book"
              />
            ) : null}
            <Field
              type="toggle-radio"
              name="favoriteFood"
              label="Favorite Food"
              options={foodOptions}
              getOptionLabel={(option) => option.toUpperCase()}
            />
            <Button disabled={formValidationState !== "complete"} type="submit">
              Submit
            </Button>
          </>
        )}
      </Form>
    </Container>
  );
}
