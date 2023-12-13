import { FutokoroService } from "./futokoro";

interface RepositoryItem {
  getId(): string;
}

interface Repository<T extends RepositoryItem> {
  get(id: string): Promise<T>;
  set(item: T): Promise<void>;
}

type PrepaidPaymentMethodRepository = Repository<PrepaidPaymentMethod>;

type PrepaidPaymentMethodDTO = Readonly<{
  id: string;
  userId: string;
  credit: number;
}>;

class PrepaidPaymentMethod implements RepositoryItem {
  private id: string;
  private userId: string;
  private credit: number;

  constructor(dto: PrepaidPaymentMethodDTO) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.credit = dto.credit;
  }

  getId(): string {
    return this.id;
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
  add(id: string, userId: string, credit: number): Promise<void>;
  updateCredit(id: string, credit: number): void;
  remove(id: string): Promise<void>;
}

class PrepaidPaymentServiceImpl implements PrepaidPaymentService {
  constructor(
    private repository: PrepaidPaymentMethodRepository,
    private futokoroService: FutokoroService
  ) {}

  async add(id: string, userId: string, credit: number): Promise<void> {
    await this.repository.set(new PrepaidPaymentMethod({ id, userId, credit }));
  }

  async updateCredit(id: string, credit: number): Promise<void> {
    const paymentMethod = await this.repository.get(id);

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

  remove(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
