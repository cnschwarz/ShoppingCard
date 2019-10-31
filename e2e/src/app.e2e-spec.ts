import {AppPage} from './app.po';
import {browser, logging, protractor} from 'protractor';
import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('register user', async () => {
    const user = 'test_1@test.ch';

    // Why?!: Firebase erstellt erzeugt ein Intervall Polling; damit kann Protractor nicht umgehen.
    await browser.waitForAngularEnabled(false);

    await page.navigateTo();
    await expect(page.getLoginName().then(x => x.length)).toEqual(10);
    await page.getLoginButton().click();
    await page.getAnonymousEmail().sendKeys(user);
    await page.getAnonymousPwd().sendKeys('12345678');
    await page.getRegisterButton().click();

    const login = page.getLogin();

    await browser.wait(() => {
      return login.getText().then((value) => {
        return login.isPresent() && value === user;
      });
    }, 10000);
    await expect(await page.getLoginName()).toEqual(user);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
