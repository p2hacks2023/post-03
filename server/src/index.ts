import { existsSync } from "fs";
import { readFile, rm, writeFile } from "fs/promises";
import path from "path";
import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";
import { createHmac, randomUUID } from "crypto";

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
  constructor(
    private id: string,
    private prepaidCredit: number
  ) {}

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
  constructor(
    private futokoroService: FutokoroService,
    private switchBotService: SwitchBotService
  ) {}

  registerPunishment(userId: string, spent: number): void {
    this.futokoroService.cooldownBySpentEstateJpy(userId, spent);
    this.switchBotService.execPunishmentBySpentEstateJpy(userId, spent);
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

class DiskSwitchbotApiKeyRepository implements SwitchBotApiKeyRepository {
  constructor(private baseDir: string) {}
  async get(userId: string): Promise<SwitchBotApiKey | undefined> {
    if (!existsSync(path.join(this.baseDir, userId))) {
      return undefined;
    }

    return SwitchBotApiKey.assemble(
      JSON.parse(
        await readFile(path.join(this.baseDir, userId), { encoding: "utf-8" })
      )
    );
  }

  async update(
    userId: string,
    switchBotApiKey: SwitchBotApiKey
  ): Promise<void> {
    await writeFile(
      path.join(this.baseDir, userId),
      JSON.stringify(switchBotApiKey.disassemble()),
      { encoding: "utf-8" }
    );
  }

  async remove(userId: string): Promise<void> {
    await rm(path.join(this.baseDir, userId));
  }

  async _(id: string): Promise<User | undefined> {
    if (!existsSync(path.join(this.baseDir, id))) {
      return undefined;
    }

    return User.assembly(
      JSON.parse(
        await readFile(path.join(this.baseDir, id), { encoding: "utf-8" })
      )
    );
  }
  async _2(id: string, value: User): Promise<void> {
    await writeFile(
      path.join("data", "users", id),
      JSON.stringify(value.disassembly()),
      { encoding: "utf-8" }
    );
  }
}

type SwitchBotApiKeyDTO = {
  token: string;
  secret: string;
};

class SwitchBotApiKey {
  private token: string;
  private secret: string;

  constructor(token: string, secret: string) {
    if (!token || !secret) {
      throw new Error("Invalid token or secret");
    }

    this.token = token;
    this.secret = secret;
  }

  getToken(): string {
    return this.token;
  }

  getSecret(): string {
    return this.secret;
  }

  static assemble(dto: SwitchBotApiKeyDTO): SwitchBotApiKey {
    return new SwitchBotApiKey(dto.token, dto.secret);
  }

  disassemble(): SwitchBotApiKeyDTO {
    return {
      token: this.token,
      secret: this.secret,
    };
  }
}

type SwitchBotApiDeviceListResult = {
  statusCode: number;
  message: string;
  body: {
    deviceList: any[];
    infraredRemoteList: any[];
  };
};

interface SwitchBotApiKeyRepository {
  get(userId: string): Promise<SwitchBotApiKey | undefined>;
  update(userId: string, switchBotApiKey: SwitchBotApiKey): Promise<void>;
  remove(userId: string): Promise<void>;
}

class SwitchBotService {
  constructor(private apiKeyRepository: SwitchBotApiKeyRepository) {}

  async assign(userId: string, token: string, secret: string): Promise<void> {
    const switchBotApiKey = new SwitchBotApiKey(token, secret);
    await this.apiKeyRepository.update(userId, switchBotApiKey);
  }

  async exists(userId: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.get(userId);

    return !!apiKey;
  }

  async delete(userId: string): Promise<void> {
    await this.apiKeyRepository.remove(userId);
  }

  async execPunishmentBySpentEstateJpy(
    userId: string,
    spentJpy: number
  ): Promise<void> {
    if (spentJpy < 10000) {
      return;
    }

    const apiKey = await this.apiKeyRepository.get(userId);

    if (!apiKey) {
      console.error("No api key submit");
      return;
    }

    const devicesResponse = await fetch(
      `https://api.switch-bot.com/v1.1/devices`,
      {
        headers: this.calcSignHeader(apiKey),
      }
    );

    if (!devicesResponse.ok) {
      console.error("Failed to get device list");
      return;
    }

    const devicesResult =
      (await devicesResponse.json()) as SwitchBotApiDeviceListResult;

    console.log(devicesResult.body.deviceList);

    const plugMinis = devicesResult.body.deviceList.filter(
      (device) =>
        device["deviceType"] === "Plug Mini (JP)" &&
        device["enableCloudService"]
    );

    console.log(plugMinis);

    plugMinis.forEach(async (plugMini) => {
      const response = await fetch(
        `https://api.switch-bot.com/v1.1/devices/${plugMini["deviceId"]}/commands`,
        {
          method: "POST",
          body: JSON.stringify({
            command: "turnOff",
            parameter: "default",
            commandType: "command",
          }),
          headers: this.calcSignHeader(apiKey),
        }
      );

      if (!response.ok) {
        console.error("Failed to send command");
      }
    });
  }

  private calcSignHeader(apiKey: SwitchBotApiKey) {
    const token = apiKey.getToken();
    const secret = apiKey.getSecret();

    const hmac = createHmac("sha256", secret);
    const time = Math.round(Date.now()).toString(10);
    const nonce = randomUUID();

    const signTerm = hmac
      .update(Buffer.from(token + time + nonce, "utf-8"))
      .digest();

    const sign = signTerm.toString("base64");

    return {
      Authorization: token,
      sign: sign,
      nonce: nonce,
      t: time,
    };
  }
}

class WebLayer {
  constructor(
    private userService: UserService,
    private futokoroEventService: FutokoroEventService,
    private switchBotService: SwitchBotService
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

      const balance = await this.userService.getBalance(userId);

      return { balance };
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

    routes.put("/user/:userId/switchbot", async (req, reply) => {
      const userId = (req.params as any)["userId"];
      const token = (req.body as any)["token"];
      const secret = (req.body as any)["secret"];

      if (
        typeof userId !== "string" ||
        typeof token !== "string" ||
        typeof secret !== "string"
      ) {
        throw new Error("Invalid input");
      }

      await this.switchBotService.assign(userId, token, secret);

      return;
    });

    routes.delete("/user/:userId/switchbot", async (req, reply) => {
      const userId = (req.params as any)["userId"];

      if (typeof userId !== "string") {
        throw new Error("Invalid input");
      }

      await this.switchBotService.delete(userId);

      return;
    });

    routes.get("/user/:userId/switchbot/exists", async (req, reply) => {
      const userId = (req.params as any)["userId"];
      if (typeof userId !== "string") {
        throw new Error("Invalid input");
      }

      const result = await this.switchBotService.exists(userId);

      return result;
    });

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
  const SWITCHBOT_REPOSITORY_DIR = path.join("data", "switchbot");

  // DI
  const userRepository = new DiskUserRepository(USER_REPOSITORY_DIR);
  const futokoroEventService = new SingleProcessFutokoroEventServiceImpl();
  const futokoroService = new FutokoroServiceImpl(futokoroEventService);
  const switchBotApiKeyRepository = new DiskSwitchbotApiKeyRepository(
    SWITCHBOT_REPOSITORY_DIR
  );
  const switchbotService = new SwitchBotService(switchBotApiKeyRepository);
  const punishmentService = new PunishmentServiceImpl(
    futokoroService,
    switchbotService
  );
  const userService = new UserService(userRepository, punishmentService);
  const webLayer = new WebLayer(
    userService,
    futokoroEventService,
    switchbotService
  );
  webLayer.run(8081);
}

main();
