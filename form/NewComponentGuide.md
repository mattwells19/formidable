# Steps to take when creating a new field component

1. Create a new tsx file in the `components/` directory named `[NewComponentName]Field.tsx`.
2. The props interface should be named similarly to the component name: `[NewComponentName]FieldProps`. The props interface should extend from the `CommonFieldSpecificProps` interface at the very least.
3. Inside the props interface add an attribute named `type` that will be used to identify the new component. It must be unique. Check the `FieldType` type in `types.ts` to see what's already being used.
4. Add an export for the new component in `components/index.ts` along with it's props interface.
5. Update the `FieldType` type located in `types.ts` to include the new component's `type`.
6. Add the new field's props interface to the `FieldSpecificProps` type located in the same file.
7. Add the new field component with its associated type to the `FieldComponent` component located in `Field.tsx`.
8. In `utils.ts` add the component's `type` either to an existing case or add a new one if needed.
9. At this point you can develop the new component and test it in `pages/index.tsx`.
   - You may need to create a new form field validation type in `zod-utils.ts` if none of the current ones work.
10. Once the component is mostly fleshed out, add the component's `type` to `FieldEditor.tsx` so that it can be used in the `custom.tsx` page.
