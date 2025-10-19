import React from "react"
import { Box, Button, Group, NumberInput, TextInput, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { validateString } from "../utils/common";

const BasicDetails = ({
    prevStep,
    nextStep,
    propertyDetails,
    setPropertyDetails,
}) => {

    const form = useForm({
        initialValues: {
            title: propertyDetails.title,
            description: propertyDetails.description,
            price: propertyDetails.price,
        },
        validate: {
            title: (value) => validateString(value),
            description: (value) => validateString(value),
            price: (value) => (value < 999 ? "Must be minimum 200000 Rupees" : null),
        },
    });

    const { title, description, price } = form.values;
    const handleSubmit = () => {
        const { hasErrors } = form.validate();
        if (!hasErrors) {
            setPropertyDetails((prev) => ({ ...prev, title, description, price }));
            nextStep();
        }
    };

    return (
        <Box maw={"50%"} mx="auto" my={"md"} >
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }} >
                <TextInput
                    required
                    label="Title"
                    placeholder="Property Name"
                    {...form.getInputProps("title")}
                />
                <TextInput
                    required
                    label="Description"
                    placeholder="Description"
                    {...form.getInputProps("description")}
                />
                <NumberInput
                required
                label="Price"
                placeholder="200000"
                min={0}
                {...form.getInputProps("price")}
                />

                <Group position="center" mt="xl" >
                    <Button variant="default" onClick={prevStep} >
                        Back
                    </Button>
                    <Button type="submit" >Next</Button>
                </Group>
            </form>
        </Box>
    );
};
export default BasicDetails;