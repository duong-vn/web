export const redirectGuest =(session:any) => {
    if(!session){
        window.location.href('/');
    }
}