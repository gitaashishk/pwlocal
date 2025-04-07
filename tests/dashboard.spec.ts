import { test, expect } from '@playwright/test';
import loginData from '../test-data/loginData.json';
import checkoutdata from '../test-data/checkoutdata.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Test for blank delivery details
test.describe('Blank Delivery Details', () => {
  checkoutdata.forEach((data,i) => {
    test(`Test ${i + 1} Blank Delivery details for user : ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      if (data.shouldLogin) {
        const success = await loginPage.isLoginSuccessful();
        expect(success).toBe(true);  // Explicitly fail if false

        if (success && data.checkoutItems && data.checkoutInfo && data.TestCase === 'emptydeliverydetails') {
      
          const inventoryPage = new InventoryPage(page);
          for (const item of data.checkoutItems) {
            await inventoryPage.addItemToCart(item);
          }
          await inventoryPage.navigateToCart();
          
      const cartPage = new CartPage(page);
          await cartPage.checkout();

      const checkoutPage = new CheckoutPage(page);  
          const info = data.checkoutInfo;
          await checkoutPage.fillCheckoutInfo(info.firstName, info.lastName, info.zipCode);

          if (page.url() === 'https://www.saucedemo.com/checkout-step-two.html') {
                await checkoutPage.completeCheckout();
            const orderSuccess = await checkoutPage.isOrderSuccessful();
            expect(orderSuccess).toBe(true);
      } else {
            console.log('Cant Place order due to invalid details');
                const checkouterrorText = await checkoutPage.invalidcheckoutdetails();
            expect(checkouterrorText).toContain('First Name is required');
    }
          //const checkerrorDisplayed = await checkoutPage.invalidcheckoutdetails();
          //expect(checkerrorDisplayed).toBe(true);  // Explicitly fail if error not displayed
    
        }

      } else {
      
            const errorDisplayed = await loginPage.isLoginError();
        expect(errorDisplayed).toBe(true);  // Explicitly fail if error not displayed

        const errorText = await loginPage.getLoginErrorMessage();
        expect(errorText).toContain('Username and password do not match');

      }
    });
  });
});