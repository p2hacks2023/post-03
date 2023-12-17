export type FirebaseUserDocument = Partial<{
  cooldown: {
    spent: number,
    lastUpdate: string
  },
  prepaidCredits: {
    [key: string]: number
  }
}>;
