
import { NumericKeys, OperatorKeys } from '../enums';
import { ICalculatorState, IContext, IStateData } from '../interfaces';
import { CalculatorModel } from '../models/calculator.model';
import { StateData } from '../models/state-data.model';
import { EnteringFirstNumberState } from './entering-first-number.state';
import { EnteringSecondNumberState } from './entering-second-number.state';
import { EnteringThirdNumberState } from './entering-third-number.state';
import { ErrorState } from './error.state';

describe('states', (): void => {
  describe('EnteringSecondNumberState', (): void => {

    let enteringSecondNumberState: EnteringSecondNumberState;
    let calculatorModel: IContext;
    let stateData: IStateData;

    beforeEach((): void => {
      calculatorModel = new CalculatorModel();
      stateData = new StateData.Builder().build();
      enteringSecondNumberState = new EnteringSecondNumberState(calculatorModel, stateData);
    });

    afterEach((): void => {
      jest.clearAllMocks();
      enteringSecondNumberState = null;
      calculatorModel = null;
      stateData = null;
    });

    describe('digit()', (): void => {

      it('should replace firstBuffer with input if firstBuffer is 0', (): void => {

        enteringSecondNumberState.data.secondBuffer = '0';

        enteringSecondNumberState.digit(NumericKeys.ONE);

        expect(enteringSecondNumberState.data.secondBuffer).toEqual('1');

      });

      it('should append the input digit to the firstBuffer if firstBuffer is not 0', (): void => {

        enteringSecondNumberState.digit(NumericKeys.ONE);

        expect(enteringSecondNumberState.data.secondBuffer).toEqual('1');

      });

    });

    describe('decimalSeparator()', (): void => {

      it('should add a decimal point to firstBuffer if the buffer is currently empty', (): void => {

        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual('.');

      });

      it('should add a decimal point at the end of firstBuffer if the buffer is not empty', (): void => {

        enteringSecondNumberState.data.secondBuffer = '12';

        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual('12.');

      });

      it('should do nothing if firstBuffer already contains a decinal point', (): void => {

        enteringSecondNumberState.data.secondBuffer = '12.34';

        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual('12.34');

      });

    });

    describe('binaryOperator()', (): void => {
      it('should convert to 1+1 to 2+ when the next operator is +', (): void => {
        enteringSecondNumberState.data.firstBuffer = '1';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = '1';
        
        jest.spyOn(enteringSecondNumberState, 'add').mockReturnValue(2);

        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);

        expect(enteringSecondNumberState.data.firstBuffer).toEqual('2');
        expect(enteringSecondNumberState.data.firstOperator).toEqual(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.secondBuffer).toEqual('');
        expect(enteringSecondNumberState.add).toHaveBeenCalledWith(1, 1);
      });

      it('should transition to ErrorState when dividing by zero', (): void => {
        enteringSecondNumberState.data.firstBuffer = '10';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.DIV;
        enteringSecondNumberState.data.secondBuffer = '0';
      
        const changeStateSpy = jest.spyOn(enteringSecondNumberState.context, 'changeState');
      
        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);
      
        expect(changeStateSpy).toHaveBeenCalledWith(expect.any(ErrorState));
      });

      it('should multiply two numbers and set the next operator', (): void => {
        enteringSecondNumberState.data.firstBuffer = '5';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MULT;
        enteringSecondNumberState.data.secondBuffer = '3';
      
        const multiplySpy = jest.spyOn(enteringSecondNumberState, 'multiply').mockReturnValue(15);
      
        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);
      
        expect(enteringSecondNumberState.data.firstBuffer).toEqual('15');
        expect(enteringSecondNumberState.data.firstOperator).toEqual(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.secondBuffer).toEqual('');
        expect(multiplySpy).toHaveBeenCalledWith(5, 3);
      });

      it('should change operator from PLUS to MULT without affecting buffers', (): void => {
        enteringSecondNumberState.data.firstBuffer = '7';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = '2';
      
        enteringSecondNumberState.binaryOperator(OperatorKeys.MULT);
      
        expect(enteringSecondNumberState.data.firstBuffer).toEqual('7');
        expect(enteringSecondNumberState.data.firstOperator).toEqual(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.secondBuffer).toEqual('2');
      });
      
      it('should subtract after multiplication', (): void => {
        enteringSecondNumberState.data.firstBuffer = '8';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MULT;
        enteringSecondNumberState.data.secondBuffer = '2';
      
        const multiplySpy = jest.spyOn(enteringSecondNumberState, 'multiply').mockReturnValue(16);
      
        enteringSecondNumberState.binaryOperator(OperatorKeys.MINUS);
      
        expect(enteringSecondNumberState.data.firstBuffer).toEqual('16');
        expect(enteringSecondNumberState.data.firstOperator).toEqual(OperatorKeys.MINUS);
        expect(enteringSecondNumberState.data.secondBuffer).toEqual('');
        expect(multiplySpy).toHaveBeenCalledWith(8, 2);
      });
      
      

    });

    describe('equals()', (): void => {
      it('should change state to EnteringFirstNumberState after addition', () => {
        enteringSecondNumberState.data.firstBuffer = '5';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = '3';
    
        enteringSecondNumberState.equals();
        expect(enteringSecondNumberState.data.firstBuffer).toBe('8'); // 5 + 3
      });
    
      it('should change state to EnteringFirstNumberState after subtraction', () => {
        enteringSecondNumberState.data.firstBuffer = '5';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MINUS;
        enteringSecondNumberState.data.secondBuffer = '2';
    
        enteringSecondNumberState.equals();
    
        expect(context.changeState).toHaveBeenCalled();
        expect(context.changeState).toHaveBeenCalledWith(expect.any(EnteringFirstNumberState));
        expect(enteringSecondNumberState.data.firstBuffer).toBe('3'); // 5 - 2
      });
    
      it('should change state to EnteringFirstNumberState after multiplication', () => {
        enteringSecondNumberState.data.firstBuffer = '4';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MULT;
        enteringSecondNumberState.data.secondBuffer = '2';
    
        enteringSecondNumberState.equals();
    
        expect(context.changeState).toHaveBeenCalled();
        expect(context.changeState).toHaveBeenCalledWith(expect.any(EnteringFirstNumberState));
        expect(enteringSecondNumberState.data.firstBuffer).toBe('8'); // 4 * 2
      });
    
      it('should change state to EnteringFirstNumberState after division', () => {
        enteringSecondNumberState.data.firstBuffer = '10';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.DIV;
        enteringSecondNumberState.data.secondBuffer = '2';
    
        enteringSecondNumberState.equals();
    
        expect(context.changeState).toHaveBeenCalled();
        expect(context.changeState).toHaveBeenCalledWith(expect.any(EnteringFirstNumberState));
        expect(enteringSecondNumberState.data.firstBuffer).toBe('5'); // 10 / 2
      });
    
      it('should change state to ErrorState when dividing by zero', () => {
        enteringSecondNumberState.data.firstBuffer = '10';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.DIV;
        enteringSecondNumberState.data.secondBuffer = '0';
    
        enteringSecondNumberState.equals();
    
        expect(context.changeState).toHaveBeenCalled();
        expect(context.changeState).toHaveBeenCalledWith(expect.any(ErrorState));
      });
    
      it('should handle empty buffers as zero in addition', () => {
        enteringSecondNumberState.data.firstBuffer = '';
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = '';
    
        enteringSecondNumberState.equals();
    
        expect(context.changeState).toHaveBeenCalled();
        expect(context.changeState).toHaveBeenCalledWith(expect.any(EnteringFirstNumberState));
        expect(enteringSecondNumberState.data.firstBuffer).toBe('0'); // 0 + 0
      });
      
    });

    describe('clear()', (): void => {

      it('should transition to EnteringFirstNumberState with empty state', (): void => {

        const expectedState: ICalculatorState = new EnteringFirstNumberState(calculatorModel, new StateData.Builder().build());
        jest.spyOn(calculatorModel, 'changeState').mockReturnValue(null);

        enteringSecondNumberState.clear();

        expect(calculatorModel.changeState)
          .toHaveBeenCalledWith(expectedState);

      });

    });

    describe('display()', (): void => {

      it('should call through to state.display()', (): void => {

        jest.spyOn(stateData, 'display').mockReturnValue('displayValue');

        enteringSecondNumberState.display();

        expect(stateData.display).toHaveBeenCalledWith();

      });

      it('should call return the value returned by state.display()', (): void => {

        jest.spyOn(stateData, 'display').mockReturnValue('displayValue');

        const returnedValue: string = enteringSecondNumberState.display();

        expect(returnedValue).toEqual('displayValue');

      });

    });

  });
});
