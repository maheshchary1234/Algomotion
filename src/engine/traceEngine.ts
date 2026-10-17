import { ExecutionStep } from '../types/algorithm';

export interface PlayerState {
  steps: ExecutionStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMs: number;
  isComplete: boolean;
}

export class TracePlayer {
  private steps: ExecutionStep[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private speedMs: number = 600;
  private timerId: any = null;
  private onStateChange: (state: PlayerState) => void;

  constructor(onStateChange: (state: PlayerState) => void, initialSpeedMs: number = 600) {
    this.onStateChange = onStateChange;
    this.speedMs = initialSpeedMs;
  }

  public loadTrace(steps: ExecutionStep[]) {
    this.pause();
    this.steps = steps.length > 0 ? steps : [];
    this.currentIndex = 0;
    this.emitState();
  }

  public getCurrentStep(): ExecutionStep | null {
    if (this.steps.length === 0) return null;
    return this.steps[this.currentIndex] || null;
  }

  public nextStep(): boolean {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.emitState();
      return true;
    } else {
      if (this.isPlaying) {
        this.pause();
      }
      return false;
    }
  }

  public prevStep(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emitState();
      return true;
    }
    return false;
  }

  public jumpToStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.currentIndex = index;
      this.emitState();
    }
  }

  public play() {
    if (this.isPlaying) return;
    if (this.currentIndex >= this.steps.length - 1) {
      this.currentIndex = 0;
    }
    this.isPlaying = true;
    this.emitState();
    this.scheduleNextTick();
  }

  public pause() {
    if (!this.isPlaying && !this.timerId) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.emitState();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public reset() {
    this.pause();
    this.currentIndex = 0;
    this.emitState();
  }

  public setSpeed(speedMs: number) {
    this.speedMs = Math.max(80, Math.min(3000, speedMs));
    if (this.isPlaying) {
      if (this.timerId) clearTimeout(this.timerId);
      this.scheduleNextTick();
    }
    this.emitState();
  }

  public destroy() {
    this.pause();
  }

  private scheduleNextTick() {
    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;
      const advanced = this.nextStep();
      if (advanced && this.currentIndex < this.steps.length - 1) {
        this.scheduleNextTick();
      } else {
        this.pause();
      }
    }, this.speedMs);
  }

  private emitState() {
    this.onStateChange({
      steps: this.steps,
      currentStepIndex: this.currentIndex,
      isPlaying: this.isPlaying,
      speedMs: this.speedMs,
      isComplete: this.steps.length > 0 && this.currentIndex === this.steps.length - 1,
    });
  }
}
