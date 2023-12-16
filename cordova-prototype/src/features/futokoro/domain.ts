export interface FutokoroService {
  cooldownBySpentEstateJpy(userId: string, spent: number): void;
}
