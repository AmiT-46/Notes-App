const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
    return regex.test(email);
}


export function getInitials(name){
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i=0; i<Math.min(words.length, 2); i++){
        initials += words[i][0];
    }
    
    return initials.toUpperCase();
};