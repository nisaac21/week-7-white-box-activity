
import { ICalculatorObserver, ICalculatorState, IContext } from '../interfaces';
import { CalculatorObserver } from '../observers';
import { EnteringSecondNumberState } from '../states/entering-second-number.state';
import { EnteringFirstNumberState } from '../states/entering-first-number.state';
import { CalculatorModel } from './calculator.model';
import { ActionKeys, NumericKeys, OperatorKeys } from '../enums';

jest.mock('../states/entering-first-number.state');
jest.mock('../states/entering-second-number.state');

describe('models', (): void => {
  describe('CalculatorModel', (): void => {

    let calculatorModel: CalculatorModel;

    beforeEach((): void => {
      calculatorModel = new CalculatorModel();
    });

    afterEach((): void => {
      (<jest.MockedClass<any>>EnteringFirstNumberState).mockClear();
      (<jest.MockedClass<any>>EnteringSecondNumberState).mockClear();
      jest.restoreAllMocks();
    });

    afterAll((): void => {
      jest.restoreAllMocks();
    });

    describe('initialization', (): void => {

      it('should have an empty list of observers', (): void => {

        expect(calculatorModel.observers).toEqual([]);

      });

      it('should have the default state as "EnteringFirstNumberState"', (): void => {

        expect(calculatorModel.state).toBeInstanceOf(EnteringFirstNumberState);

      });

    });

    describe('attach()', (): void => {

      it('should register an observer', (): void => {

        const observer: ICalculatorObserver = new CalculatorObserver();

        calculatorModel.attach(observer);

        expect(calculatorModel.observers).toContain(observer);

      });

      it('should register multiple observers', (): void => {

        const observer1: ICalculatorObserver = new CalculatorObserver();
        const observer2: ICalculatorObserver = new CalculatorObserver();
        const observer3: ICalculatorObserver = new CalculatorObserver();

        calculatorModel.attach(observer1);
        calculatorModel.attach(observer2);
        calculatorModel.attach(observer3);


        expect(calculatorModel.observers).toContain(observer1);
        expect(calculatorModel.observers).toContain(observer2);
        expect(calculatorModel.observers).toContain(observer3);

      });

    });

    describe('detach()', (): void => {

      it('should remove a registered observer', (): void => {

        const observer: ICalculatorObserver = new CalculatorObserver();
        calculatorModel.attach(observer);

        calculatorModel.detach(observer);

        expect(calculatorModel.observers).not.toContain(observer);

      });

      it('should remove multiple registered observers', (): void => {

        const observer1: ICalculatorObserver = new CalculatorObserver();
        const observer2: ICalculatorObserver = new CalculatorObserver();
        const observer3: ICalculatorObserver = new CalculatorObserver();
        calculatorModel.attach(observer1);
        calculatorModel.attach(observer2);
        calculatorModel.attach(observer3);

        calculatorModel.detach(observer1);
        calculatorModel.detach(observer2);

        expect(calculatorModel.observers).not.toContain(observer1);
        expect(calculatorModel.observers).not.toContain(observer2);
        expect(calculatorModel.observers).toContain(observer3);

      });

    });

    describe('notify()', (): void => {

      it('should invoke "update" on every observer with "message"', (): void => {

        const observer1: ICalculatorObserver = new CalculatorObserver();
        const observer2: ICalculatorObserver = new CalculatorObserver();
        const observer3: ICalculatorObserver = new CalculatorObserver();

        jest.spyOn(observer1, 'update').mockReturnThis();
        jest.spyOn(observer2, 'update').mockReturnThis();
        jest.spyOn(observer3, 'update').mockReturnThis();

        calculatorModel.attach(observer1);
        calculatorModel.attach(observer2);
        calculatorModel.attach(observer3);

        (<IContext>calculatorModel).notify('message');

        expect(observer1.update).toHaveBeenCalledWith('message');
        expect(observer2.update).toHaveBeenCalledWith('message');
        expect(observer3.update).toHaveBeenCalledWith('message');

      });

    });

    describe('changeState()', (): void => {

      it('should change the state to provided state', (): void => {

        const newState: ICalculatorState = new EnteringSecondNumberState(<any>{}, <any>{});

        calculatorModel.changeState(newState);

        expect(calculatorModel.state).toEqual(newState);

      });

    });

    describe('pressNumericKey()', (): void => {

      it('should invoke state.digit() with given key', (): void => {

        jest.spyOn(calculatorModel.state, 'digit').mockReturnThis();

        calculatorModel.pressNumericKey(NumericKeys.ONE);

        expect(calculatorModel.state.digit).toHaveBeenCalledWith(NumericKeys.ONE);

      });

    });

    describe('pressOperatorKey()', (): void => {

      it('should invoke state.binaryOperator() with given key', (): void => {

        jest.spyOn(calculatorModel.state, 'binaryOperator').mockReturnThis();

        calculatorModel.pressOperatorKey(OperatorKeys.PLUS);

        expect(calculatorModel.state.binaryOperator).toHaveBeenCalledWith(OperatorKeys.PLUS);

      });

    });

    describe('pressActionKey()', (): void => {

      it('should invoke state.clear() when invoked with "CLEAR"', (): void => {

        jest.spyOn(calculatorModel.state, 'clear').mockReturnThis();

        calculatorModel.pressActionKey(ActionKeys.CLEAR);

        expect(calculatorModel.state.clear).toHaveBeenCalled();

      });

      it('should invoke state.decimalSeparator() when invoked with "DOT"', (): void => {

        jest.spyOn(calculatorModel.state, 'decimalSeparator').mockReturnThis();

        calculatorModel.pressActionKey(ActionKeys.DOT);

        expect(calculatorModel.state.decimalSeparator).toHaveBeenCalled();

      });

      it('should invoke state.equals() when invoked with "EQUALS"', (): void => {

        jest.spyOn(calculatorModel.state, 'equals').mockReturnThis();

        calculatorModel.pressActionKey(ActionKeys.EQUALS);

        expect(calculatorModel.state.equals).toHaveBeenCalled();

      });

      it('should throw an error if invoked with any other imput', (): void => {

        expect((): void => {
          calculatorModel.pressActionKey(undefined);
        }).toThrowError('Invalid Action');

      });

    });

    describe('display()', (): void => {

      it('should invoke state.display()', (): void => {

        jest.spyOn(calculatorModel.state, 'display').mockReturnValue('foo');

        calculatorModel.display();

        expect(calculatorModel.state.display).toHaveBeenCalled();

      });

      it('should return the value returned by state.display()', (): void => {

        jest.spyOn(calculatorModel.state, 'display').mockReturnValue('foo');

        const returnValue: string = calculatorModel.display();

        expect(returnValue).toEqual('foo');

      });

    });

  });
});
