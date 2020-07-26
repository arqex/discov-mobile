import { Platform } from 'react-native';
import BackButtonHandler from './BackButtonHandler';

describe('BackButtonHandler', () => {
  describe('Non-android', () => {
    Platform.OS = 'ios';

    it('init() should be callable', () => {
      expect( BackButtonHandler.init( getBackHandlerMock() ) ).toBeUndefined();
    });

    it('addListener() should be callable', () => {
      expect( BackButtonHandler.addListener( () => true ) ).toBeUndefined();
    });

    it('removeListener() should be callable', () => {
      expect( BackButtonHandler.removeListener( () => true ) ).toBeUndefined();
    });
  });

  describe('Android', () => {
    let bhMock;

    beforeEach( () => {
      Platform.OS = 'android';
      bhMock = getBackHandlerMock();
      BackButtonHandler.init( bhMock );
      BackButtonHandler.clearListeners();
    });

    it('init() should add the back listener', () => {
      let bhMock = getBackHandlerMock();
      expect( bhMock.addEventListener ).not.toHaveBeenCalled();
      BackButtonHandler.init( bhMock );
      expect( bhMock.addEventListener ).toHaveBeenCalled();
    });

    it('methods bound using addListener() should be called in order', () => {
      let calls = [];
      let method1 = () => calls.push('m1') && false;
      let method2 = () => calls.push('m2') && false;
      let method3 = () => calls.push('m3') && false;

      BackButtonHandler.addListener( method1 );
      BackButtonHandler.addListener( method2 );
      BackButtonHandler.addListener( method3 );

      bhMock.mockPressBack();

      expect( calls ).toEqual( ['m3', 'm2', 'm1'] );
    });

    it('when all listeners returns false should call the default action', () => {
      let calls = [];
      let method1 = () => calls.push('m1') && false;
      let method2 = () => calls.push('m2') && false;
      let method3 = () => calls.push('m3') && false;

      BackButtonHandler.addListener( method1 );
      BackButtonHandler.addListener( method2 );
      BackButtonHandler.addListener( method3 );

      bhMock.mockPressBack();

      expect( bhMock.exitApp ).toHaveBeenCalled();
    });
    
    it('when a listener return true, following listeners shouldnt be called', () => {
      let calls = [];
      let method1 = () => calls.push('m1') && false;
      let method2 = () => calls.push('m2') && true;
      let method3 = () => calls.push('m3') && false;

      BackButtonHandler.addListener( method1 );
      BackButtonHandler.addListener( method2 );
      BackButtonHandler.addListener( method3 );

      bhMock.mockPressBack();

      expect( calls ).toEqual( ['m3', 'm2'] );
    });

    
    it('when a listener return true, the default action should not be called', () => {
      let calls = [];
      let method1 = () => calls.push('m1') && false;
      let method2 = () => calls.push('m2') && true;
      let method3 = () => calls.push('m3') && false;

      BackButtonHandler.addListener( method1 );
      BackButtonHandler.addListener( method2 );
      BackButtonHandler.addListener( method3 );

      bhMock.mockPressBack();

      expect( bhMock.exitApp ).not.toHaveBeenCalled();
    });

    it('removeListener() should remove the method from the list of calls', () => {
      let calls = [];
      let method1 = () => calls.push('m1') && false;
      let method2 = () => calls.push('m2') && false;
      let method3 = () => calls.push('m3') && false;

      BackButtonHandler.addListener( method1 );
      BackButtonHandler.addListener( method2 );
      BackButtonHandler.addListener( method3 );

      BackButtonHandler.removeListener( method2 );

      bhMock.mockPressBack();

      expect( calls ).toEqual( ['m3', 'm1'] );
    });
  });
});

function getBackHandlerMock() {
  const _backPressSubscriptions = new Set();

  return {
    exitApp: jest.fn(),
  
    addEventListener: jest.fn( function(
      eventName: 'hardwareBackPress',
      handler: () => boolean,
    ): {remove: () => void} {
      _backPressSubscriptions.add(handler);
      return {
        remove: () => this.removeEventListener(eventName, handler),
      };
    }),
  
    removeEventListener: jest.fn(function(
      eventName: 'hardwareBackPress',
      handler: () => boolean,
    ): void {
      _backPressSubscriptions.delete(handler);
    }),
  
    mockPressBack: function() {
      let invokeDefault = true;

      const subscriptions: any[] = [..._backPressSubscriptions].reverse();
      for (let i = 0; i < subscriptions.length; ++i) {
        if (subscriptions[i]()) {
          invokeDefault = false;
          break;
        }
      }
  
      if (invokeDefault) {
        this.exitApp();
      }
    }
  }
}
