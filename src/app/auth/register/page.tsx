'use client'
import ModalCreateUser from "./ModalCreateUser"
import { useState } from "react"

export default function signUp () {
    const [isOpen, setIsOpen] = useState(true);  

    return (

        <ModalCreateUser isModalOpen = {isOpen} setIsModalOpen={setIsOpen}

        
        />

    )


}