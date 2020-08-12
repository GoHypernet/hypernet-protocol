export interface IPaymentService {
    sendPayment(channelId: int, amount: float): Promise<Payment>;
}