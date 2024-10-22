
import { ICalculatorObserver } from '../interfaces';
import { CalculatorObserver } from './calculator-observer';

describe('CalculatorObserver', (): void => {

  let calculatorObserver: ICalculatorObserver;

  beforeEach((): void => {
    calculatorObserver = new CalculatorObserver();
    jest.spyOn(console, 'log').mockReturnThis();
  });

  afterEach((): void => {
    jest.resetAllMocks();
  });

  afterAll((): void => {
    jest.restoreAllMocks();
  });

  describe('update()', (): void => {

    it('should invoke "console.log" with "CalculatorObserver: " followed by message', (): void => {

      calculatorObserver.update('some message');

      expect(console.log).toHaveBeenCalledWith('CalculatorObserver: some message');

    });

  });

});
