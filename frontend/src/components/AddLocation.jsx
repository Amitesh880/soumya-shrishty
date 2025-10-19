import React from 'react'
import { useForm } from "@mantine/form"
import { validateString } from '../utils/common'
import useCountries from '../hooks/useCountries'
import { Select, TextInput, Group, Button } from "@mantine/core"
import Map from "./Map"

const AddLocation = ({ propertyDetails, setPropertyDetails, nextStep }) => {
    const form = useForm({
        initialValues: {
            country: propertyDetails?.country || '',
            city: propertyDetails?.city || '',
            address: propertyDetails?.address || '',
        },
        validate: {
            country: validateString,
            city: validateString,
            address: validateString,
        },
    });
    const { country, city, address } = form.values
    const { getAll } = useCountries()

    const handleSubmit = () => {
        // NOTE: Mantine form typically uses 'hasErrors' (plural) not 'hasError'
        const { hasErrors } = form.validate() 
        if (!hasErrors) {
            setPropertyDetails((prev) => ({ ...prev, country, city, address }))
            nextStep()
        }
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
        >
            {/* Added 'gap-4' and 'flex-wrap' for better layout */}
            <div className='flex justify-center flex-wrap gap-4'> 
                
                {/* LEFT SIDE - Inputs: Ensure it can grow/shrink */}
                <div style={{ minWidth: '300px' }} className='flex justify-center flex-1'>
                    <div>
                        <Select
                            w={"100%"}
                            required
                            label="Country"
                            clearable
                            searchable
                            data={getAll()}
                            {...form.getInputProps("country", { type: "input" })}
                        />
                        <TextInput
                            w={"100%"}
                            required
                            label="city"
                            mt="md" // Added margin for spacing
                            {...form.getInputProps("city", { type: "input" })}
                        />
                        <TextInput
                            w="100%"
                            required
                            label="address"
                            mt="md" // Added margin for spacing
                            {...form.getInputProps("address", { type: "input" })}
                        />

                    </div>
                </div>
                
                {/* RIGHT SIDE - Map Container: THE CRITICAL FIX IS HERE */}
                <div 
                    style={{ 
                        flex: 1, 
                        minWidth: '300px', 
                        // **This height is essential for map rendering** 🔑
                        height: '400px', 
                        borderRadius: '8px',
                        overflow: 'hidden' 
                    }}
                >
                    <Map address={address} city={city} country={country} />
                </div>
            </div>
            
            <Group justify='center' mt='xl'>
                <Button type='submit'>
                    Next Step
                </Button>
            </Group>
        </form>
    )
}

export default AddLocation;