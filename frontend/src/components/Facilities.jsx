import React, { useContext } from "react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { createResidency } from "../utils/api";
import UserDetailContext from "../context/UserDetailContext";
import useProperties from "../hooks/useProperties";

const Facilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities?.bedrooms || 0,
      parkings: propertyDetails.facilities?.parkings || 0,
      bathrooms: propertyDetails.facilities?.bathrooms || 0,
    },
    validate: {
      bedrooms: (value) =>
        value < 1 ? "Must have at least one bedroom" : null,
      bathrooms: (value) =>
        value < 1 ? "Must have at least one bathroom" : null,
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;
  const { user } = useAuth();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const { refetch: refetchProperties } = useProperties();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      createResidency(
        {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
        },
        token,
        user?.email
      ),
    onSuccess: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
      setPropertyDetails({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        img: null,
        facilities: {
          bedrooms: 0,
          parkings: 0,
          bathrooms: 0,
        },
        userEmail: user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    },
    onError: ({ response }) =>
      toast.error(response.data.message, { position: "bottom-right" }),
  });

  const handleSubmit = () => {
    const { hasError } = form.validate();
    if (!hasError) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms },
      }));
      mutate();
    }
  };

  return (
    <Box maw={"30%"} mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          required
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
        />
        <NumberInput
          label="No of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
        />
        <NumberInput
          required
          label="No of Bathrooms"
          min={0}
          {...form.getInputProps("bathrooms")}
        />

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;