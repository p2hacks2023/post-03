"use strict";
/*
  1. ユーザーを作成してIDを払い出すことができる
  2. ユーザーのプリペイドカード残高を設定できる
  3. ユーザーのプリペイドカード残高が引かれたらイベントが発生する
  4. イベントをリッスンできる
  5. SwitchBotのトークンを設定できる
  6.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutokoroServiceImpl = exports.PunishmentServiceImpl = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const cors_1 = __importDefault(require("@fastify/cors"));
function createRandomId() {
    return Math.random().toString(36).substring(2);
}
class User {
    id;
    prepaidCredit;
    constructor(id, prepaidCredit) {
        this.id = id;
        this.prepaidCredit = prepaidCredit;
    }
    getId() {
        return this.id;
    }
    getPrepaidCredit() {
        return this.prepaidCredit;
    }
    setPrepaidCredit(prepaidCredit) {
        return (this.prepaidCredit = prepaidCredit);
    }
    static assembly(dto) {
        return new User(dto.id, dto.prepaidCredit);
    }
    disassembly() {
        return {
            id: this.id,
            prepaidCredit: this.prepaidCredit,
        };
    }
}
class UserService {
    userRepository;
    punishmentService;
    constructor(userRepository, punishmentService) {
        this.userRepository = userRepository;
        this.punishmentService = punishmentService;
    }
    async create() {
        const id = createRandomId();
        await this.userRepository.update(id, new User(id, 0));
        return id;
    }
    async getBalance(id) {
        const user = await this.userRepository.get(id);
        if (!user) {
            throw new Error("No such user");
        }
        return user.getPrepaidCredit();
    }
    async setPrepaidCredit(id, credit) {
        const user = await this.userRepository.get(id);
        if (!user) {
            throw new Error("No such user");
        }
        if (user.getPrepaidCredit() - credit > 0) {
            this.punishmentService.registerPunishment(id, user.getPrepaidCredit() - credit);
        }
        user.setPrepaidCredit(credit);
        await this.userRepository.update(id, user);
        return;
    }
}
class PunishmentServiceImpl {
    futokoroService;
    constructor(futokoroService) {
        this.futokoroService = futokoroService;
    }
    registerPunishment(userId, spent) {
        this.futokoroService.cooldownBySpentEstateJpy(userId, spent);
    }
}
exports.PunishmentServiceImpl = PunishmentServiceImpl;
class SingleProcessFutokoroEventServiceImpl {
    listeners = new Map();
    emit(userId, event) {
        const listeners = this.listeners.get(userId);
        if (!listeners) {
            return;
        }
        for (const listener of listeners.values()) {
            listener(event);
        }
    }
    listenEvent(userId, listener) {
        const listenerSet = this.listeners.get(userId) ?? new Set();
        listenerSet.add(listener);
        this.listeners.set(userId, listenerSet);
        return () => {
            listenerSet.delete(listener);
        };
    }
}
class FutokoroServiceImpl {
    futokoroEventService;
    constructor(futokoroEventService) {
        this.futokoroEventService = futokoroEventService;
    }
    async cooldownBySpentEstateJpy(userId, spent) {
        if (spent < 100) {
            this.futokoroEventService.emit(userId, {
                type: "cooldown",
                lengthSec: 10,
            });
        }
        else if (spent < 500) {
            this.futokoroEventService.emit(userId, {
                type: "cooldown",
                lengthSec: 20,
            });
        }
        else if (spent < 1000) {
            this.futokoroEventService.emit(userId, {
                type: "cooldown",
                lengthSec: 30,
            });
        }
        else if (spent < 10000) {
            // Go to hell
            this.futokoroEventService.emit(userId, {
                type: "cooldown",
                lengthSec: 120,
            });
        }
    }
}
exports.FutokoroServiceImpl = FutokoroServiceImpl;
class DiskUserRepository {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    async get(id) {
        if (!(0, fs_1.existsSync)(path_1.default.join(this.baseDir, id))) {
            return undefined;
        }
        return User.assembly(JSON.parse(await (0, promises_1.readFile)(path_1.default.join(this.baseDir, id), { encoding: "utf-8" })));
    }
    async update(id, value) {
        await (0, promises_1.writeFile)(path_1.default.join("data", "users", id), JSON.stringify(value.disassembly()), { encoding: "utf-8" });
    }
}
class WebLayer {
    userService;
    futokoroEventService;
    constructor(userService, futokoroEventService) {
        this.userService = userService;
        this.futokoroEventService = futokoroEventService;
    }
    async run(port) {
        const routes = (0, fastify_1.default)({
            logger: true,
        });
        await routes.register(websocket_1.default);
        await routes.register(cors_1.default);
        routes.post("/user/create", async () => {
            const id = await this.userService.create();
            return { uid: id };
        });
        routes.get("/user/:userId/balance", async (req, reply) => {
            const userId = req.params["userId"];
            if (typeof userId !== "string") {
                throw new Error("Invalid input");
            }
            return { balance: await this.userService.getBalance(userId) };
        });
        routes.put("/user/:userId/credit", async (req, reply) => {
            const userId = req.params["userId"];
            const credit = req.body["credit"];
            if (typeof userId !== "string" && typeof credit !== "number") {
                throw new Error("Invalid input");
            }
            await this.userService.setPrepaidCredit(userId, credit);
            return;
        });
        routes.get("/user/:userId/futokoro", { websocket: true }, async (connection, req) => {
            console.log(req.params);
            const userId = req.params["userId"];
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
    const USER_REPOSITORY_DIR = path_1.default.join("data", "users");
    const userRepository = new DiskUserRepository(USER_REPOSITORY_DIR);
    const futokoroEventService = new SingleProcessFutokoroEventServiceImpl();
    const futokoroService = new FutokoroServiceImpl(futokoroEventService);
    const punishmentService = new PunishmentServiceImpl(futokoroService);
    const userService = new UserService(userRepository, punishmentService);
    const webLayer = new WebLayer(userService, futokoroEventService);
    webLayer.run(8081);
}
main();
