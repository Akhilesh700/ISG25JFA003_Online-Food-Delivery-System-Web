
export type DeliveryAgentStatus = 'Available' | 'InDelivery' | 'Offline';

export interface IDeliveryAgent {
    agentId: number,
    name: string,
    email: string,
    phone: string,
    status: DeliveryAgentStatus,
    identityProofType: string,
    identityProofNo: string
}