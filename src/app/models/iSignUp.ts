export interface iRestaurantSignup{
    email: string,
    password: string,
    name: string,
    openTime: string,
    closeTime: string,
    phone: string,
    address: string
}
export interface iCustomerSignup{
    email: string,
    password: string,
    name: string,
    phone: string,
    dob: string
    address: string
}
export interface iAgentSignup{
    email: string,
    password: string,
    name: string,
    phone: string,
    identityProofType: string
    identityProofNo: string
}