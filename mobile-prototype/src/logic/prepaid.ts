import { FutokoroService } from "./futokoro";

interface RepositoryItem<K> {
  getId(): K;
}

interface Repository<T extends RepositoryItem<K>, K = ReturnType<T["getId"]>> {
  get(id: K): Promise<T>;
  set(item: T): Promise<void>;
}

export type PrepaidPaymentMethodRepository = Repository<PrepaidPaymentMethod>;

type PrepaidPaymentMethodDTO = Readonly<{
  id: string;
  userId: string;
  credit: number;
}>;

export class PrepaidPaymentMethod implements RepositoryItem<{userId: string, id: string}> {
  private id: string;
  private userId: string;
  private credit: number;

  constructor(dto: PrepaidPaymentMethodDTO) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.credit = dto.credit;
  }

  getId(): {userId: string, id: string} {
    return {id: this.id, userId: this.userId};
  }

  getCredit() {
    return this.credit;
  }

  getUserId() {
    return this.userId;
  }

  updateCredit(newCredit: number) {
    this.credit = newCredit;
  }

  static assembly(dto: PrepaidPaymentMethodDTO) {
    return new PrepaidPaymentMethod(dto);
  }

  disassembly(): PrepaidPaymentMethodDTO {
    return {
      id: this.id,
      userId: this.userId,
      credit: this.credit,
    };
  }
}

interface PrepaidPaymentService {
  add(userId: string, id: string, credit: number): Promise<void>;
  updateCredit(userId: string, id: string, credit: number): void;
  remove(userId: string, id: string): Promise<void>;
}

export class PrepaidPaymentServiceImpl implements PrepaidPaymentService {
  constructor(
    private repository: PrepaidPaymentMethodRepository,
    private futokoroService: FutokoroService
  ) {}

  async add(id: string, userId: string, credit: number): Promise<void> {
    await this.repository.set(new PrepaidPaymentMethod({ id, userId, credit }));
  }

  async updateCredit(id: string, userId: string, credit: number): Promise<void> {
    const paymentMethod = await this.repository.get({id, userId});

    if (!paymentMethod) {
      throw new Error("Failed to get payment method");
    }

    const previousCredit = paymentMethod.getCredit();

    if (credit < previousCredit) {
      this.futokoroService.cooldownBySpentEstateJpy(
        paymentMethod.getUserId(),
        previousCredit - credit
      );
    }

    paymentMethod.updateCredit(credit);

    await this.repository.set(paymentMethod);

    return;
  }

  remove(id: string, userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
