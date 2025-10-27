import { TestBed } from "@angular/core/testing";
import { OrderApiService, PlaceOrderResponse, UpdatePaymentRequest } from "./order-api.service"
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from "src/environments/environment";

type status = 'Successful' | 'Pending' | 'Failed'

fdescribe('OrderApiService', () => {
    let service:OrderApiService;
    let httpMock:  HttpTestingController;
    let baseApiUrl: string

    beforeEach(() => {
        // configuring test bed
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrderApiService]
        });

        //inject service and mock controller
        service = TestBed.inject(OrderApiService);
        httpMock = TestBed.inject(HttpTestingController);

        baseApiUrl = `${environment.apiUrl}api/${environment.version}/customer/orders`;
    });


    afterEach(() => {
        // no outstanding http requests
        httpMock.verify();
    });

    it('Should be created', () => {
        // should not be null
        expect(service).toBeTruthy();
    })

    // Testing for placeholder
    it('Should send a POST request to place an order', () => {
        // mock data
        const mockCartId = 1231;
        const  mockResponse: PlaceOrderResponse = {
            orderId: 1231,
            items: 7,
            note: "Fetch it from user"
        };

        const expectedUrl = `${baseApiUrl}/place`;
        const expectedBody = { note: "Fetch it from user" };

        // calling the service
        service.placeOrder(mockCartId).subscribe(res => {
            expect(res).toEqual(mockResponse);
        })

        // Except the req to correct URL
        const req = httpMock.expectOne(expectedUrl);

        // verify req method and body
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(expectedBody);

        // Flush the request
        req.flush(mockResponse);
    });

    it('should send a PUT request to update payment status', () => {
    // 1. Define mock data
    const mockOrderId = 99;
    const mockPaymentId = 'pay_abc123';
    const mockStatus: status = 'Successful';
    const mockAmount = 150.75;

    // The expected URL and request body
    const expectedUrl = `${baseApiUrl}/${mockOrderId}/payment`;
    const expectedBody: UpdatePaymentRequest = {
      paymentId: mockPaymentId,
      status: mockStatus,
      amount: mockAmount
    };

    // 2. Call the service method
    service.updatePaymentStatus(mockOrderId, mockPaymentId, mockStatus, mockAmount)
      .subscribe(response => {
        // 5. This runs after the flush. Expect null for a void response.
        expect(response).toBeNull();
      });

    // 3. Expect a request to the correct URL
    const req = httpMock.expectOne(expectedUrl);

    // 4. Verify the request method and body
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expectedBody);

    // 5. "Flush" the request, sending back null (for Observable<void>)
    req.flush(null);
  });

})