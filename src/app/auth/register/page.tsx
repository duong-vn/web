'use client'
import ModalCreateUser from "./ModalCreateUser"
import { useState } from "react"
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
export default function signUp () {
    const [isOpen, setIsOpen] = useState(true);
    const {status} = useSession();  
    if(status == 'authenticated' ){
        toast.error(`You've already signed in`)
        window.location.href='/'
    }
    return (

        <ModalCreateUser isModalOpen = {isOpen} setIsModalOpen={setIsOpen}

        
        />

    )


}