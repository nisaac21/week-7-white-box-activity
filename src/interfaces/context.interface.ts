import { ICalculatorState } from './calculator-state.interface';

export interface IContext {
  changeState(state: ICalculatorState): void;
  notify(message: string): void;
}
