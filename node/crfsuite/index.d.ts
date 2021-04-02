export interface Tagger {
  tag(xseq: Array<string[]>): { probability: number; result: string[] }
  open(model_filename: string): boolean
}
export interface Options {
  [key: string]: string
}

export interface TrainerCallback {
  (str: string): void
}

export interface Trainer {
  append(xseq: Array<string[]>, yseq: string[]): void
  train(model_filename: string): void
  set_params(options: Options): void
  set_callback(callback: TrainerCallback): void
}

export declare const Trainer: () => Trainer
export declare const Tagger: () => Tagger
