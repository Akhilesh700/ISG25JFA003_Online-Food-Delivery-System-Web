import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common'; // <-- 1. IMPORT CommonModule

// NgRx Store testing
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/state/app.state';
import { emptyCart } from 'src/app/state/cart/cart.action';
import { selectCartItems, selectCartRestaurant, selectTotalPrice } from 'src/app/state/cart/cart.selector';

// Component and Dependencies
import { Checkout } from './checkout';
import { IDish, IResturant } from 'src/app/models/resturantInterface';
import { IUser, userService } from 'src/app/core/services/customer/userService';
import { CartApiService } from 'src/app/core/services/customer/checkout/cart-api.service';
import { OrderApiService, PlaceOrderResponse } from 'src/app/core/services/customer/order-api.service';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { PaymentSucessDialog } from './components/payment-sucess-dialog/payment-sucess-dialog';

// --- Mock Data (Based on your interfaces) ---
const mockUser: IUser = {
  userId: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  avatarUrl: 'http://avatar.com/img.png',
  location: 'Test Location'
};

const mockCartItems: IDish[] = [
  {
    itemId: 101,
    name: 'Test Dish 1',
    price: 100,
    quantity: 1,
    imgUrl: 'http://images.com/dish.png',
    isAvailable: true,
    isVegetarian: true,
    description: 'A test dish.',
    rating: 4.5,
    category: 'Main Course'
  }
];

const mockRestaurant: IResturant = {
  id: 1,
  name: 'Test Restaurant',
  address: '123 Test St',
  bannerUrl: 'http://images.com/banner.png',
  logoUrl: 'http://images.com/logo.png',
  rating: 4.2,
  ETA: '30 mins',
  isOpen: true,
  deliveryFee: 40,
  dishes: []
};

const mockCartResponse = { cartId: 55 };
const mockOrderResponse: PlaceOrderResponse = { orderId: 123, items: 1, note: '' };
const mockPaymentId: string = 'pay_sahdkf'; // Mock payment ID string

fdescribe('Checkout Component', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let store: MockStore<AppState>;
  let mockUserService: jasmine.SpyObj<userService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialogService: jasmine.SpyObj<ZardDialogService>;
  let mockCartApiService: jasmine.SpyObj<CartApiService>;
  let mockOrderApiService: jasmine.SpyObj<OrderApiService>;
  let mockZone: { run: (fn: Function) => any };

  // Spies for external Razorpay
  let mockRzpInstance: { open: jasmine.Spy };
  let mockRazorpay: jasmine.Spy;

  beforeEach(async () => {
    // 1. Create spy objects for all services
    mockUserService = jasmine.createSpyObj('userService', ['useCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialogService = jasmine.createSpyObj('ZardDialogService', ['create']);
    mockCartApiService = jasmine.createSpyObj('CartApiService', ['saveCart']);
    mockOrderApiService = jasmine.createSpyObj('OrderApiService', ['placeOrder', 'updatePaymentStatus']);

    // 2. Create a mock for NgZone
    mockZone = {
      run: (fn: Function) => fn() // Run the function synchronously
    };

    // 3. Mock the global Razorpay object
    mockRzpInstance = { open: jasmine.createSpy('open') };
    mockRazorpay = jasmine.createSpy('Razorpay').and.returnValue(mockRzpInstance);
    (window as any).Razorpay = mockRazorpay;

    // 4. Configure the TestBed
    await TestBed.configureTestingModule({
      imports: [
        Checkout,
        CommonModule // <-- 1. ADD CommonModule HERE
      ],
      providers: [
        provideMockStore(), // Set up the mock store
        { provide: NgZone, useValue: mockZone },
        { provide: userService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ZardDialogService, useValue: mockDialogService },
        { provide: CartApiService, useValue: mockCartApiService },
        { provide: OrderApiService, useValue: mockOrderApiService },
      ],
      // Use NO_ERRORS_SCHEMA to ignore child components (e.g., <app-delivery-details>)
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    // 5. Inject dependencies
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Checkout);

    // 6. Set up mock return values and store selectors
    mockUserService.useCurrentUser.and.returnValue(mockUser);

    store.overrideSelector(selectCartItems, mockCartItems);
    store.overrideSelector(selectCartRestaurant, mockRestaurant);
    store.overrideSelector(selectTotalPrice, 100); // Use 100 as the base price

    // 7. Trigger constructor logic and ngOnInit
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create and initialize user', () => {
    expect(component).toBeTruthy();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should calculate summary$ and set component.amount from totalPrice$', (done) => {
    // The constructor logic runs with totalPrice = 100
    // Calculations to verify:
    // price = 100
    // promotion = 100 * 0.03 = 3
    // deliveryFee = Math.max(100 * 0.12, 40) = 40
    // deliveryDiscount = Math.min(40 * 0.2, 10) = 8
    // taxesAndFees = 100 * 0.18 + 100 * 0.05 = 23
    // total = 100 - 3 + 40 - 8 + 23 = 152

    component.summary$.subscribe(summary => {
      expect(summary.subtotal).toBe(100);
      expect(summary.promotion).toBe(3);
      expect(summary.deliveryFee).toBe(40);
      expect(summary.deliveryDiscount).toBe(8);
      expect(summary.taxesAndFees).toBe(23);
      expect(summary.total).toBe(152);

      // Also check the side-effect
      expect(component.amount).toBe(152);
      done();
    });
  });

  it('should execute the full onPay() flow successfully', fakeAsync(() => {
    // Arrange
    const dispatchSpy = spyOn(store, 'dispatch');
    const openSuccessDialogSpy = spyOn(component, 'openSuccessDialog'); // Spy on component's own method

    mockCartApiService.saveCart.and.returnValue(of(mockCartResponse));
    mockOrderApiService.placeOrder.and.returnValue(of(mockOrderResponse));
    mockOrderApiService.updatePaymentStatus.and.returnValue(of(void 0)); // for success

    // Act
    component.onPay();
    tick(); // Resolve forkJoin, switchMaps

    // Assert: Check service call chain
    expect(mockCartApiService.saveCart).toHaveBeenCalledWith(mockCartItems);
    expect(mockOrderApiService.placeOrder).toHaveBeenCalledWith(mockCartResponse.cartId);

    // Assert: Check Razorpay was called
    expect(mockRazorpay).toHaveBeenCalled();
    expect(mockRzpInstance.open).toHaveBeenCalled();

    // Act: Simulate successful payment
    // 1. Get the options passed to Razorpay
    const razorpayOptions = mockRazorpay.calls.mostRecent().args[0];
    
    // 2. Call the 'handler' (success callback) with the mockPaymentId string
    // <-- 3. FIX: Use the 'mockPaymentId' variable
    razorpayOptions.handler({ razorpay_payment_id: mockPaymentId });
    tick(); // Resolve updatePaymentStatus

    // Assert: Final state after success
    expect(mockOrderApiService.updatePaymentStatus).toHaveBeenCalledWith(
      mockOrderResponse.orderId,
      mockPaymentId, // <-- 3. FIX: Asserts the string is passed
      'Successful',
      component.amount
    );
    expect(dispatchSpy).toHaveBeenCalledWith(emptyCart());
    expect(openSuccessDialogSpy).toHaveBeenCalledWith(
      mockOrderResponse.orderId,
      12, // <-- 3. FIX: Asserts the string is passed
      component.amount,
      mockRestaurant
    );
  }));

  it('should handle onPay() failure at saveCart step', fakeAsync(() => {
    // Arrange
    const consoleErrorSpy = spyOn(console, 'error');
    const error = new Error('Cart Save Failed');
    mockCartApiService.saveCart.and.returnValue(throwError(() => error));

    // Act
    component.onPay();
    tick();

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to place order:', error);
    expect(mockOrderApiService.placeOrder).not.toHaveBeenCalled();
    expect(mockRazorpay).not.toHaveBeenCalled();
  }));

  it('should handle Razorpay dismissal (payment failure)', fakeAsync(() => {
    // Arrange
    const dispatchSpy = spyOn(store, 'dispatch');
    const openSuccessDialogSpy = spyOn(component, 'openSuccessDialog');

    mockCartApiService.saveCart.and.returnValue(of(mockCartResponse));
    mockOrderApiService.placeOrder.and.returnValue(of(mockOrderResponse));
    mockOrderApiService.updatePaymentStatus.and.returnValue(of(void 0)); // for failure

    // Act: Start payment
    component.onPay();
    tick();

    // Assert: Razorpay opened
    expect(mockRazorpay).toHaveBeenCalled();
    expect(mockRzpInstance.open).toHaveBeenCalled();

    // Act: Simulate user closing the modal
    // 1. Get options
    const razorpayOptions = mockRazorpay.calls.mostRecent().args[0];
    // 2. Call the 'ondismiss' callback
    razorpayOptions.modal.ondismiss();
    tick(); // Resolve updatePaymentStatus

    // Assert: Final state after failure
    expect(mockOrderApiService.updatePaymentStatus).toHaveBeenCalledWith(
      mockOrderResponse.orderId,
      'TXN_FAILED_ajhf63refYAG', // Asserts the hardcoded failure ID from your component
      'Failed',
      component.amount
    );
    expect(dispatchSpy).toHaveBeenCalledWith(emptyCart());
    expect(openSuccessDialogSpy).not.toHaveBeenCalled();
  }));

  it('should open the success dialog with correct data', () => {
    const mockStringPaymentId = 'pay_555444'; // Use string to match component

    // Act
    component.openSuccessDialog(99, mockStringPaymentId as any, 152, mockRestaurant);

    // Assert
    expect(mockDialogService.create).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        zTitle: 'Payment Success',
        zContent: PaymentSucessDialog,
        zData: {
          orderId: 99,
          paymentId: mockStringPaymentId, // Checks for the string
          paymentDate: jasmine.any(String),
          restaurant: mockRestaurant,
          amount: 152
        },
        zOkText: 'Track Order',
        zWidth: '425px'
      })
    );
    
  });
});