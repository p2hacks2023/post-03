/*
  1. ユーザーを作成してIDを払い出すことができる
  2. ユーザーのプリペイドカード残高を設定できる
  3. ユーザーのプリペイドカード残高が引かれたらイベントが発生する
  4. イベントをリッスンできる
  5. SwitchBotのトークンを設定できる
  6. 
*/

import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";

function createRandomId() {
  return Math.random().toString(36).substring(2);
}

interface UserRepository {
  get(id: string): Promise<User | undefined>;
  update(id: string, value: User): Promise<void>;
}

type UserDTO = {
  id: string;
  prepaidCredit: number;
};

class User {
  constructor(private id: string, private prepaidCredit: number) {}

  getId(): string {
    return this.id;
  }
  getPrepaidCredit(): number {
    return this.prepaidCredit;
  }
  setPrepaidCredit(prepaidCredit: number): number {
    return (this.prepaidCredit = prepaidCredit);
  }

  static assembly(dto: UserDTO) {
    return new User(dto.id, dto.prepaidCredit);
  }

  disassembly(): UserDTO {
    return {
      id: this.id,
      prepaidCredit: this.prepaidCredit,
    };
  }
}

export interface PunishmentService {
  registerPunishment(userId: string, spent: number): void;
}

class UserService {
  constructor(
    private userRepository: UserRepository,
    private punishmentService: PunishmentService
  ) {}

  async create(): Promise<string> {
    const id = createRandomId();

    await this.userRepository.update(id, new User(id, 0));

    return id;
  }
  async getBalance(id: string): Promise<number> {
    const user = await this.userRepository.get(id);

    if (!user) {
      throw new Error("No such user");
    }

    return user.getPrepaidCredit();
  }
  async setPrepaidCredit(id: string, credit: number): Promise<void> {
    const user = await this.userRepository.get(id);
    if (!user) {
      throw new Error("No such user");
    }

    if (user.getPrepaidCredit() - credit > 0) {
      this.punishmentService.registerPunishment(
        id,
        user.getPrepaidCredit() - credit
      );
    }

    user.setPrepaidCredit(credit);

    await this.userRepository.update(id, user);

    return;
  }
}

export class PunishmentServiceImpl implements PunishmentService {
  constructor(private futokoroService: FutokoroService) {}

  registerPunishment(userId: string, spent: number): void {
    this.futokoroService.cooldownBySpentEstateJpy(userId, spent);
  }
}

export interface FutokoroService {
  cooldownBySpentEstateJpy(userId: string, spent: number): void;
}

export interface FutokoroEventService {
  emit(userId: string, event: FutokoroEvent): void;
  listenEvent(
    userId: string,
    listener: (event: FutokoroEvent) => void
  ): Dispose;
}

type Dispose = () => void;
type FutokoroEvent = { type: "cooldown"; lengthSec: number };
type FutokoroEventListener = (eventListener: FutokoroEvent) => void;

class SingleProcessFutokoroEventServiceImpl implements FutokoroEventService {
  private listeners: Map<string, Set<FutokoroEventListener>> = new Map();

  emit(userId: string, event: FutokoroEvent): void {
    const listeners = this.listeners.get(userId);

    if (!listeners) {
      return;
    }

    for (const listener of listeners.values()) {
      listener(event);
    }
  }

  listenEvent(
    userId: string,
    listener: (event: FutokoroEvent) => void
  ): Dispose {
    const listenerSet = this.listeners.get(userId) ?? new Set();
    listenerSet.add(listener);

    this.listeners.set(userId, listenerSet);

    return () => {
      listenerSet.delete(listener);
    };
  }
}

export class FutokoroServiceImpl implements FutokoroService {
  constructor(private futokoroEventService: FutokoroEventService) {}

  async cooldownBySpentEstateJpy(userId: string, spent: number): Promise<void> {
    if (spent < 100) {
      this.futokoroEventService.emit(userId, {
        type: "cooldown",
        lengthSec: 10,
      });
    } else if (spent < 500) {
      this.futokoroEventService.emit(userId, {
        type: "cooldown",
        lengthSec: 20,
      });
    } else if (spent < 1000) {
      this.futokoroEventService.emit(userId, {
        type: "cooldown",
        lengthSec: 30,
      });
    } else if (spent < 10000) {
      // Go to hell
      this.futokoroEventService.emit(userId, {
        type: "cooldown",
        lengthSec: 120,
      });
    }
  }
}

class DiskUserRepository implements UserRepository {
  constructor(private baseDir: string) {}

  async get(id: string): Promise<User | undefined> {
    if (!existsSync(path.join(this.baseDir, id))) {
      return undefined;
    }

    return User.assembly(
      JSON.parse(
        await readFile(path.join(this.baseDir, id), { encoding: "utf-8" })
      )
    );
  }
  async update(id: string, value: User): Promise<void> {
    await writeFile(
      path.join("data", "users", id),
      JSON.stringify(value.disassembly()),
      { encoding: "utf-8" }
    );
  }
}

class WebLayer {
  constructor(
    private userService: UserService,
    private futokoroEventService: FutokoroEventService
  ) {}

  async run(port: number): Promise<void> {
    const routes = fastify({
      logger: true,
    });

    await routes.register(fastifyWebsocket);
    await routes.register(fastifyCors);

    routes.post("/user/create", async () => {
      const id = await this.userService.create();

      return { uid: id };
    });

    routes.get("/user/:userId/balance", async (req, reply) => {
      const userId = (req.params as any)["userId"];

      if (typeof userId !== "string") {
        throw new Error("Invalid input");
      }

      return { balance: await this.userService.getBalance(userId) };
    });

    routes.put("/user/:userId/credit", async (req, reply) => {
      const userId = (req.params as any)["userId"];
      const credit = (req.body as any)["credit"];

      if (typeof userId !== "string" && typeof credit !== "number") {
        throw new Error("Invalid input");
      }

      await this.userService.setPrepaidCredit(userId, credit);

      return;
    });

    routes.get(
      "/user/:userId/futokoro",
      { websocket: true },
      async (connection, req) => {
        console.log(req.params);
        const userId = (req.params as any)["userId"];
        if (typeof userId !== "string") {
          throw new Error("Invalid input");
        }

        const unlisten = this.futokoroEventService.listenEvent(userId, (ev) => {
          console.log("Event!", ev);
          connection.socket.send(JSON.stringify(ev));
        });

        connection.socket.on("close", () => {
          unlisten();
        });
      }
    );

    routes.listen({ host: "0.0.0.0", port }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }
}

function main() {
  const USER_REPOSITORY_DIR = path.join("data", "users");
  const userRepository = new DiskUserRepository(USER_REPOSITORY_DIR);
  const futokoroEventService = new SingleProcessFutokoroEventServiceImpl();
  const futokoroService = new FutokoroServiceImpl(futokoroEventService);
  const punishmentService = new PunishmentServiceImpl(futokoroService);
  const userService = new UserService(userRepository, punishmentService);
  const webLayer = new WebLayer(userService, futokoroEventService);
  webLayer.run(8081);
}

main();
