import { ICalculatorObserver } from '../interfaces';

export class CalculatorObserver implements ICalculatorObserver {

  public update(message: string): void {
    console.log(`CalculatorObserver: ${message}`);
  }

}
