import { useEffect } from "react";

 export function GetCustomClaim() {
    fetch('https://ly-firebase-cfg.netlify.app/.netlify/functions/admin', {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));



    useEffect(() => {
        const getCustomClaims = async () => {
            const uid = 'tpTtSmZKExeCv9rIUoZRaJX6igs2';
            const response = await fetch(`https://ly-firebase-cfg.netlify.app/.netlify/functions/checkCustomClaims?uid=${uid}`);
            const data = await response.json();
            console.log(data);
        };

        getCustomClaims();
    }, []);

}