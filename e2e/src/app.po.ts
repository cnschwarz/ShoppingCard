import {browser, by, element, protractor} from 'protractor';


const EC = protractor.ExpectedConditions;

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getLoginButton() {
    return element(by.css('.test-user-settings'));
  }

  getLogin() {
    return element(by.css('.test-user-name'));
  }

  getLoginName() {
    const ele = element(by.css('.test-user-name'));
    browser.wait(EC.visibilityOf(ele), 10000, 'Custom Error Message');
    return ele.getText() as Promise<string>;
  }

  getAnonymousLoginCard() {
    const ele = element(by.css('.test-anonymous-login-card'));
    browser.wait(EC.visibilityOf(ele), 10000, 'Custom Error Message');
    return ele;
  }

  getAnonymousEmail() {
    const ele = element(by.css('.test-anonymous-login-card input[type=email]'));
    browser.wait(EC.visibilityOf(ele), 10000, 'Custom Error Message');
    return ele;
  }

  getAnonymousPwd() {
    const ele = element(by.css('.test-anonymous-login-card input[type=password]'));
    browser.wait(EC.visibilityOf(ele), 10000, 'Custom Error Message');
    return ele;
  }

  getRegisterButton() {
    const ele = element(by.css('.test-anonymous-login-card button:nth-of-type(2)'));
    browser.wait(EC.visibilityOf(ele), 10000, 'Custom Error Message');
    return ele;
  }
}
