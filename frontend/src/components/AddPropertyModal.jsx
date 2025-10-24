import React, { useState } from 'react'
import { Stepper } from '@mantine/core'
import { Container,Modal } from '@mantine/core'
import AddLocation from './AddLocation'
import {useAuth} from "../context/AuthContext"
import UploadImage from './UploadImage'
import BasicDetails from './BasicDetails'
import Facilities from './Facilities'

const AddPropertyModal = ({ opened, setOpened }) => {
    const [active, setActive] = useState(0)
    const {user} = useAuth()
    const [propertyDetails, setPropertyDetails] = useState({
        title:"",
        description:"",
        price:0,
        address:"",
        media: [],
        facilities:{
            bedrooms:0,
            bathrooms:0,
            parkings:0
        },
        userEmail: user?.email
    })
    const nextStep = () => {
        setActive((current) => (current < 4 ? current + 1 : current))
    }
    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current))
    }
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            closeOnClickOutside
            size={"90rem"}
        >
            <Container h={"34rem"} w={"100%"} >
                <>
                    <Stepper active={active} onStepClick={setActive}>
                        <Stepper.Step label="Location" description="Location Details">
                            <AddLocation
                            nextStep={nextStep}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            />
                        </Stepper.Step>
                        <Stepper.Step label="Image" description="Upload">
                            <UploadImage
                            prevStep={prevStep}
                            nextStep={nextStep}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            />
                        </Stepper.Step>
                        <Stepper.Step label="Basic" description="Details">
                            <BasicDetails
                            prevStep={prevStep}
                            nextStep={nextStep}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            />
                        </Stepper.Step>
                        <Stepper.Step label="Facilities" description="Details">
                            <Facilities
                            prevStep={prevStep}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            setOpened={setOpened}
                            setActiveStep={setActive}
                            />
                        </Stepper.Step>
                    </Stepper>
                </>
            </Container>
        </Modal>
    )
}
export default AddPropertyModal;