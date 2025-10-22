interface iRestaurantSignup{
    email: string,
    password: string,
    name: string,
    openTime: string,
    closeTime: string,
    phone: string,
    address: string
}
interface iCustomerSignup{
    email: string,
    password: string,
    name: string,
    phone: string,
    dob: string
    address: string
}
interface iAgentSignup{
    email: string,
    password: string,
    name: string,
    phone: string,
    identityProofType: string
    identityProofNo: string
}